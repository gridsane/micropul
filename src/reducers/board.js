import * as actions from '../actions/actionsTypes';

const initialState = [];

export default function board(state = initialState, action) {
  const handler = handlers[action.type];

  if (typeof(handler) !== 'undefined') {
    return handler(state, action);
  }

  return state;
}

const handlers = {
  [actions.BOARD_CONNECT_TILE]: (state, action) => {
    return state;
  },
};
