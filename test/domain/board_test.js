import * as board from '../../src/domain/board';

describe('Board logic', () => {

  it('returns 48 possible tiles', () => {
    expect(board.possibleTiles.length).toBe(48);
  });

  it('rotates tile', () => {

    const corners = [[1], [2], [3], [4]];

    expect(board.rotateCorners(corners, 0)).toEqual(corners);
    expect(board.rotateCorners(corners, 1)).toEqual([[4], [1], [2], [3]]);
    expect(board.rotateCorners(corners, 2)).toEqual([[3], [4], [1], [2]]);
    expect(board.rotateCorners(corners, 3)).toEqual([[2], [3], [4], [1]]);
    expect(board.rotateCorners(corners, 4)).toEqual(corners);

  });

  it('gets corners side corners', () => {

    const corners = [[1], [2], [3], [4]];

    expect(board.getSideCorners(corners, 0)).toEqual([[1], [2]]);
    expect(board.getSideCorners(corners, 1)).toEqual([[2], [3]]);
    expect(board.getSideCorners(corners, 2)).toEqual([[3], [4]]);
    expect(board.getSideCorners(corners, 3)).toEqual([[4], [1]]);
    expect(board.getSideCorners(corners, 4)).toEqual([[1], [2]]);

  });

  it('connects tiles with same colors', () => {

    const tiles = [
      {
        i: 0, j: 0,
        corners: [[0], [0], [1], [1]],
        rotation: 0,
      },
    ];

    const tile = {
      corners: [[1], [1], [0], [0]],
      rotation: 0,
    };

    // 1 1
    // 0 0
    // ! !
    // 0 0
    // 1 1
    expect(board.canConnect(tiles, tile, -1, 0)).toBe(false);

    // 0 0 ! 1 1
    // 1 1 ! 0 0
    expect(board.canConnect(tiles, tile, 0, 1)).toBe(false);

    // 0 0
    // 1 1
    // + +
    // 1 1
    // 0 0
    expect(board.canConnect(tiles, tile, 1, 0)).toBe(true);

    // 1 1 ! 0 0
    // 0 0 ! 1 1
    expect(board.canConnect(tiles, tile, 0, -1)).toBe(false);

  });

  it('do not connects tiles with different colors', () => {

    const tiles = [{
      i: 0, j: 0,
      corners: [[1], [0], [1], [2]],
      rotation: 0,
    }];

    const tile = {
      corners: [[1], [1], [2], [0]],
      rotation: 0,
    };

    // 1 0
    // 2 1
    // ! +
    // 1 1
    // 0 2
    expect(board.canConnect(tiles, tile, 1, 0)).toBe(false);

    // 1 1 + 1 0
    // 0 2 + 2 1
    expect(board.canConnect(tiles, tile, 0, -1)).toBe(true);

  });

  it('connects tiles with rotation', () => {

    const tiles = [{
      i: 0, j: 0,
      corners: [[1], [0], [1], [2]],
      rotation: 0,
    }];

    const corners = [[1], [1], [2], [0]];

    // 1 0
    // 2 1
    // + +
    // 0 1  >>  1 1 -> rotation 1
    // 2 1  >>  0 2
    expect(board.canConnect(tiles, {corners, rotation: 1}, 1, 0)).toBe(true);

    // 1 0
    // 2 1
    // + +
    // 2 0  >>  1 1 -> rotation 2
    // 1 1  >>  0 2
    expect(board.canConnect(tiles, {corners, rotation: 2}, 1, 0)).toBe(true);

    // 1 0
    // 2 1
    // ! +
    // 1 0  >>  1 1 -> rotation 3
    // 1 2  >>  0 2
    expect(board.canConnect(tiles, {corners, rotation: 3}, 1, 0)).toBe(false);

  });

  it('connects tile with respect of all surrounding tiles', () => {

    const tiles = [
      {
        i: 0, j: 0,
        corners: [[1], [0], [1], [2]],
        rotation: 0,
      },
      {
        i: 0, j: 1,
        corners: [[0], [0], [1], [1]],
        rotation: 0,
      },
      {
        i: 0, j: 2,
        corners: [[0], [0], [0], [1]],
        rotation: 0,
      },
      {
        i: 1, j: 0,
        corners: [[2], [0], [2], [0]],
        rotation: 0,
      },
      {
        i: 1, j: 2,
        corners: [[1], [0], [1], [0]],
        rotation: 0,
      },
      {
        i: 2, j: 0,
        corners: [[0], [2], [1], [0]],
        rotation: 0,
      },
      {
        i: 2, j: 1,
        corners: [[0], [1], [2], [1]],
        rotation: 0,
      },
      {
        i: 2, j: 2,
        corners: [[0], [1], [0], [2]],
        rotation: 0,
      },
    ];

    // 1 0 | 0 0 | 0 0
    // 2 1 | 1 1 | 1 0
    // - -         - -
    // 2 0   0 1   1 0
    // 0 2   2 0   0 1
    // - -         - -
    // 0 2 | 0 1 | 0 1
    // 0 1 | 1 2 | 2 0

    const tile1 = {corners: [[0], [1], [0], [2]], rotation: 0};
    expect(board.canConnect(tiles, tile1, 1, 1)).toBe(true);

    // 1 0 | 0 0 | 0 0
    // 2 1 | 1 1 | 1 0
    // - -         - -
    // 2 0   1 0   1 0  >> 0 1 -> rotation 1
    // 0 2   0 2   0 1  >> 2 0
    // - -     !   - -
    // 0 2 | 0 1 | 0 1
    // 0 1 | 1 2 | 2 0
    const tile2 = {corners: [[0], [1], [0], [2]], rotation: 1};
    expect(board.canConnect(tiles, tile2, 1, 1)).toBe(false);

  });

});
