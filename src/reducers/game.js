import * as actions from '../actions/actionsTypes';
import {possibleTiles} from '../domain/board';
import {getRandomInt} from '../utils';
import update from 'react-addons-update';

const initialState = {
  gameId: null,
  playerId: null,
  stones: 3,
  supply: 6,
  hand: [],
  isFinished: false,
  isWaiting: false,
  boardStones: [],
  board: [
    {
      id: 38,
      i: 2, j: 2,
      corners: [[1], [1], [2], [2]],
      rotation: 0,
    },
  ],
};

export default function game(state = initialState, action) {
  const handler = handlers[action.type];

  if (typeof(handler) !== 'undefined') {
    return handler(state, action);
  }

  return state;
}

const handlers = {
  [actions.BOARD_ADD_TILE]: (state, action) => {
    return update(state, {
      board: {$push: [action.tile]},
      hand: {$splice: state.hand.reduce(function (args, tile, index) {
        if (tile.id === action.tile.id) {
          args.push([index, 1]);
        }

        return args;
      }, [])},
    });
  },
  [actions.SUPPLY_REFILL]: (state, action) => {
    const totalTilesInGame = state.board.length + state.supply + state.hand.length;

    if (possibleTiles.length < totalTilesInGame + action.count) {
      return state;
    }

    return update(state, {
      supply: {$set: state.supply + action.count},
    });
  },
  [actions.HAND_ADD_TILE]: (state) => {
    if (state.supply === 0) {
      return state;
    }

    const ids = [...state.board.map((tile) => tile.id), ...state.hand.map((tile) => tile.id)];
    const randomIndex = getRandomInt(0, possibleTiles.length - ids.length);
    const pile = possibleTiles.filter((tile) => ids.indexOf(tile.id) === -1);
    const tile = pile[randomIndex];

    return update(state, {
      supply: {$set: state.supply - 1},
      hand: {$push: [tile]},
    });
  },
};
