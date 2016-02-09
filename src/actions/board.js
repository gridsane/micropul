import * as types from './actionsTypes';

export function addTile(tile) {
  return {type: types.BOARD_ADD_TILE, tile};
}
