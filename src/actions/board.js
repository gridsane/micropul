import * as types from './actionsTypes';

export function connectTile(tile, target, side) {
  return {type: types.BOARD_CONNECT_TILE, tile, target, side};
}
