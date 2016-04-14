import * as actions from '../actions/actionsTypes';
import {
  possibleTiles,
  canConnect,
  getCatalysts,
  getGroup,
  isBigTile,
  transformTiles,
} from '../domain/board';
import {atIndex, shuffle, arg2str} from '../utils';
import update from 'react-addons-update';

const initialState = {
  gameId: null,
  playerId: null,
  players: [
    // {
    //   id: 1,
    //   supply: 0,
    //   hand: [{id: tileId, rotation: 0}, ...]
    //   stones: [{i: 1, j: 1, corner: 0}],
    //   score: 0,
    // },
  ],
  turnQueue: [], // [playerId, ...],
  board: [],
  isFinished: false,
  startedAt: null,
  updatedAt: null,
};

export default function game(state = initialState, action) {
  const handler = handlers[action.type];

  if (typeof(handler) !== 'undefined') {
    return handler(state, action);
  }

  return state;
}

const handlers = {
  [actions.GAME_START]: (state, action) => {
    const startedAt = new Date();
    const tilesOnHands = getRandomTiles({
      board: [],
      players: [],
    }, action.playersIds.length * 6);

    return {
      gameId: action.gameId,
      playerId: state.playerId,
      players: action.playersIds.map((id, index) => {
        const startHandIndex = Math.max(0, (index * 6) - 1);
        return {
          id,
          supply: 0,
          hand: tilesOnHands.slice(startHandIndex, startHandIndex + 6),
          stones: [],
          score: 0,
        };
      }),
      turnQueue: [action.playersIds[0]],
      board: [{id: 0, i: 0, j: 0, rotation: 0}],
      isFinished: false,
      startedAt: startedAt,
      updatedAt: startedAt,
    };
  },

  [actions.GAME_PLACE_STONE]: (state, action) => {
    const {i, j, corner, playerId} = action;

    if (playerId !== state.turnQueue[0]) {
      return state;
    }

    const playerIndex = getCurrentPlayerIndex(state.turnQueue[0], state.players);

    if (state.players[playerIndex].stones.length >= 3) {
      return state;
    }

    const tiles = transformTiles(state.board);
    const occupiedGroups = state.players.reduce((acc, p) => {
      p.stones.forEach((stone) => {
        const group = getGroup(tiles, stone.i, stone.j, stone.corner);
        acc.push(...group.map((c) => arg2str(c.i, c.j, c.corner)));
      });

      return acc;
    }, []);

    const targetGroup = getGroup(tiles, i, j, corner).map((c) => arg2str(c.i, c.j, c.corner));
    const isGroupOccupied = targetGroup.reduce((acc, c) => {
      return acc && occupiedGroups.indexOf(c) !== -1;
    }, true);

    if (isGroupOccupied) {
      return state;
    }

    return update(state, {
      players: {
        [playerIndex]: {
          stones: {$push: [{i, j, corner}]},
        },
      },
      turnQueue: setNextTurn(state.turnQueue, state.players),
      updatedAt: setNow(),
    });
  },

  [actions.GAME_CONNECT_TILE]: (state, action) => {
    const {playerId, tileId, rotation, i, j} = action;

    if (playerId !== state.turnQueue[0]) {
      return state;
    }

    const playerIndex = getCurrentPlayerIndex(playerId, state.players);
    const player = state.players[playerIndex];
    if (!player.hand.find((t) => t.id === tileId)) {
      return state;
    }

    const boardTiles = transformTiles(state.board);
    const tile = transformTiles([{id: tileId, rotation}])[0];

    if (!canConnect(boardTiles, tile, i, j)) {
      return state;
    }

    const availableTilesCount = getAvailableTilesCount(state);
    const catalysts = getCatalysts(boardTiles, tile, i, j);

    const nextTurn = -1 !== catalysts.indexOf(5)
      ? {turnQueue: {
          $push: (new Array(catalysts.filter(c => c === 5).length - 1).fill(player.id)),
        }} : {turnQueue: setNextTurn(state.turnQueue, state.players)};

    const supplyIncrement = Math.min(
      availableTilesCount,
      catalysts.filter(c => c === 3).length
      + (catalysts.filter(c => c === 4).length * 2)
    );

    const isFinished = availableTilesCount <= 1;
    const nextBoardTiles = [...boardTiles, {...tile, i, j}];
    const nextState = update(state, {
      board: {$push: [{id: tileId, i, j, rotation}]},
      players: {
        [playerIndex]: {
          hand: {$splice: player.hand.reduce((args, t, index) => {
            if (t.id === tileId) {
              args.push([index, 1]);
            }

            return args;
          }, [])},
          supply: {$set: player.supply + supplyIncrement},
        },
      },
      updatedAt: setNow(),
      isFinished: {$set: isFinished},
      ...nextTurn,
    });

    if (isFinished) {
      const scores = calculateScores(nextState, nextBoardTiles);
      return update(nextState, {
        players: {$set: nextState.players.map((player) => {
          return {...player, score: scores[player.id]};
        })},
      });
    }

    return nextState;
  },
  [actions.GAME_REFILL_HAND]: (state, action) => {
    const {playerId, count} = action;

    if (playerId !== state.turnQueue[0]) {
      return state;
    }

    const playerIndex = getCurrentPlayerIndex(playerId, state.players);
    const supply = state.players[playerIndex].supply;

    if (supply === 0) {
      return state;
    }

    return update(state, {
      players: {
        [playerIndex]: {
          supply: {$set: Math.max(0, supply - count)},
          hand: {$push: getRandomTiles(state, Math.min(count, supply))},
        },
      },
      turnQueue: setNextTurn(state.turnQueue, state.players),
      updatedAt: setNow(),
    });
  },
  [actions.GAME_SKIP_TURN]: (state, action) => {
    const playerId = action.playerId;

    if (playerId !== state.turnQueue[0]) {
      return state;
    }

    return update(state, {
      turnQueue: setNextTurn(state.turnQueue, state.players),
      updatedAt: setNow(),
    });
  },
  [actions.GAME_MERGE_STATE]: (state, action) => {
    return {...state, ...action.newState};
  },
};

function setNow() {
  return {$set: new Date()};
}

function setNextTurn(queue, players) {
  const ids = players.map((p) => p.id);

  if (queue.length > 1) {
    return {$splice: [[0, 1]]};
  } else {
    return {$set: [atIndex(ids, ids.indexOf(queue[0]) + 1)]};
  }
}

function getCurrentPlayerIndex(currentTurn, players) {
  const ids = players.map((p) => p.id);
  return ids.indexOf(currentTurn);
}

function getClosedTiles(state) {
  const inGameTilesIds = [
    ...state.board.map((t) => t.id),
    ...state.players.reduce((acc, p) => {
      acc.push(...p.hand.map((t) => t.id));
      return acc;
    }, []),
  ];

  return possibleTiles.filter((t) => {
    return inGameTilesIds.indexOf(t.id) === -1;
  });
}

function getRandomTiles(state, count) {
  const closedTiles = getClosedTiles(state);
  return shuffle(closedTiles).slice(0, count).map((t) => {
    return {id: t.id, rotation: 0};
  });
}

function getAvailableTilesCount(state) {
  const supply = state.players.reduce((acc, p) => acc + p.supply, 0);
  return getClosedTiles(state).length - supply;
}

function calculateScores(state, tiles) {
  const groups = state.players.reduce((acc, p) => {
    p.stones.forEach((stone, index) => {
      const group = getGroup(tiles, stone.i, stone.j, stone.corner);
      acc.push({hash: hashGroup(group), group, playerId: p.id, index});
    });
    return acc;
  }, []);

  let countedPositions = [];
  return groups.reduce((scores, g) => {
    if (groups.filter((sg) => sg.hash === g.hash).length === 1) {
      scores[g.playerId] += g.group.length + g.group.reduce((bigTilesPoints, c) => {
        const posHash = arg2str(c.i, c.j);
          if (countedPositions.indexOf(posHash) === -1) {
            const tile = tiles.find((t) => t.i === c.i && t.j === c.j);
            if (isBigTile(tile)) {
              bigTilesPoints += 1;
            }

            countedPositions.push(posHash);
          }

          return bigTilesPoints;
        }, 0);
    }

    return scores;
  }, state.players.reduce((initialScores, p) => {
    initialScores[p.id] = 0;
    return initialScores;
  }, {}));
}

function hashGroup(group) {
  return group.map((c) => {
    return arg2str(c.i, c.j, c.corner);
  }).sort().join(',');
}
