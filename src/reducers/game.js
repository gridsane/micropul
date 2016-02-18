import * as actions from '../actions/actionsTypes';
import {possibleTiles, canConnect, getCatalysts} from '../domain/board';
import {getSecureToken, atIndex, shuffle} from '../utils';
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
    // },
  ],
  currentTurn: null, // playerId,
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
      gameId: getSecureToken(),
      playerId: state.playerId,
      players: action.playersIds.map((id, index) => {
        const startHandIndex = Math.max(0, (index * 6) - 1);
        return {
          id,
          supply: 0,
          hand: tilesOnHands.slice(startHandIndex, startHandIndex + 6),
          stones: [],
        };
      }),
      currentTurn: action.playersIds[0],
      board: [{id: 0, i: 0, j: 0, rotation: 0}],
      isFinished: false,
      startedAt: startedAt,
      updatedAt: startedAt,
    };
  },

  [actions.GAME_PLACE_STONE]: (state, action) => {
    const {i, j, corner, playerId} = action;

    if (playerId !== state.currentTurn) {
      return state;
    }

    const playerIndex = getCurrentPlayerIndex(state.currentTurn, state.players);

    return update(state, {
      players: {
        [playerIndex]: {
          stones: {$push: [{i, j, corner}]},
        },
      },
      currentTurn: setNextTurn(state.currentTurn, state.players),
      updatedAt: setNow(),
    });
  },

  [actions.GAME_CONNECT_TILE]: (state, action) => {
    const {playerId, tileId, rotation, i, j} = action;

    if (playerId !== state.currentTurn) {
      return state;
    }

    const playerIndex = getCurrentPlayerIndex(playerId, state.players);
    const player = state.players[playerIndex];
    if (!player.hand.find((t) => t.id === tileId)) {
      return state;
    }

    const boardTiles = transformTiles(state.board);
    const tile = transformTile({id: tileId, rotation});

    if (!canConnect(boardTiles, tile, i, j)) {
      return state;
    }

    const catalysts = getCatalysts(boardTiles, tile, i, j);
    // extra turn
    const nextTurn = -1 !== catalysts.indexOf(5)
      ? {}
      : {currentTurn: setNextTurn(state.currentTurn, state.players)};

    let nextSupply = player.supply;
    // refill supply by 1
    if (-1 !== catalysts.indexOf(3)) {
      nextSupply = nextSupply + 1;
    }

    // refill supply by 2
    if (-1 !== catalysts.indexOf(4)) {
      nextSupply = nextSupply + 2;
    }

    return update(state, {
      board: {$push: [{id: tileId, i, j, rotation}]},
      players: {
        [playerIndex]: {
          hand: {$splice: player.hand.reduce((args, t, index) => {
            if (t.id === tileId) {
              args.push([index, 1]);
            }

            return args;
          }, [])},
          supply: {$set: nextSupply},
        },
      },
      updatedAt: setNow(),
      ...nextTurn,
    });
  },
  [actions.GAME_REFILL_HAND]: (state, action) => {
    const {playerId, count} = action;

    if (playerId !== state.currentTurn) {
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
      currentTurn: setNextTurn(state.currentTurn, state.players),
      updatedAt: setNow(),
    });
  },
  [actions.GAME_SKIP_TURN]: (state, action) => {
    const playerId = action.playerId;

    if (playerId !== state.currentTurn) {
      return state;
    }

    return update(state, {
      currentTurn: setNextTurn(playerId, state.players),
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

function setNextTurn(currentTurn, players) {
  const ids = players.map((p) => p.id);
  return {$set: atIndex(ids, ids.indexOf(currentTurn) + 1)};
}

function getCurrentPlayerIndex(currentTurn, players) {
  const ids = players.map((p) => p.id);
  return ids.indexOf(currentTurn);
}

function getRandomTiles(state, count) {
  const inGameTilesIds = [
    ...state.board.map((t) => t.id),
    ...state.players.reduce((acc, p) => {
      acc.push(...p.hand.map((t) => t.id));
      return acc;
    }, []),
  ];

  const remainingTiles = possibleTiles.filter((t) => {
    return inGameTilesIds.indexOf(t.id) === -1;
  });

  return shuffle(remainingTiles).slice(0, count).map((t) => {
    return {id: t.id, rotation: 0};
  });
}

function transformTile(tile) {
  return {
    ...tile,
    corners: possibleTiles.find((t) => t.id === tile.id).corners,
  };
}

function transformTiles(tiles) {
  return tiles.map(transformTile);
}
