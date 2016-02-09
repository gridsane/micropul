import * as actions from '../actions/actionsTypes';

const initialState = [
  {
    id: 38,
    i: 2, j: 2,
    corners: [[1], [1], [2], [2]],
    rotation: 0,
  },
];

export default function board(state = initialState, action) {
  const handler = handlers[action.type];

  if (typeof(handler) !== 'undefined') {
    return handler(state, action);
  }

  return state;
}

const handlers = {
  [actions.BOARD_ADD_TILE]: (state, action) => {
    return [...state, ...[action.tile]];
  },
};
