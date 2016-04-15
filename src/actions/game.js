import * as types from './actionsTypes';

export function start(gameId, playersIds) {
  return {type: types.GAME_START, gameId, playersIds};
}

export function connectTile(playerId, tileId, rotation, i, j) {
  return {type: types.GAME_CONNECT_TILE, playerId, tileId, rotation, i, j};
}

export function refillHand(playerId, count = 1) {
  return {type: types.GAME_REFILL_HAND, playerId, count};
}

export function placeStone(playerId, id, corner) {
  return {type: types.GAME_PLACE_STONE, playerId, id, corner};
}

export function skipTurn(playerId) {
  return {type: types.GAME_SKIP_TURN, playerId};
}

export function mergeState(newState) {
  return {type: types.GAME_MERGE_STATE, newState};
}
