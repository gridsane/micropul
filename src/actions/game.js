import * as types from './actionsTypes';

export function boardAddTile(tile) {
  return {type: types.BOARD_ADD_TILE, tile};
}

export function refillSupply(count = 1) {
  return {type: types.SUPPLY_REFILL, count};
}

export function handAddTile() {
  return {type: types.HAND_ADD_TILE};
}

export function applyCatalysts(catalysts) {
  return (dispatch) => {
    catalysts.forEach((catalyst) => {
      switch (catalyst) {
        case 3:
          dispatch(refillSupply(1));
        case 4:
          dispatch(refillSupply(2));
        case 5:
          // play again
        default:
          break;
      }
    });
  };
}
