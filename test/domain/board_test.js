import * as board from '../../src/domain/board';

describe('Board', () => {

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

  it('does not connect tiles with different colors', () => {
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

  it('does not connect tiles without micropul connection', () => {
    const tiles = [{
      i: 0, j: 0,
      corners: [[1], [0], [2], [3]],
      rotation: 0,
    }];

    const tile = {
      corners: [[1], [4], [3], [0]],
      rotation: 0,
    };

    expect(board.canConnect(tiles, tile, 0, -1)).toBe(false);
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

  it('do not connects a tile to the occupied position', () => {
    const tiles = [
      {i: 0, j: 0, corners: [[1], [1], [2], [2]], rotation: 0},
      {i: 0, j: 1, corners: [[1], [1], [2], [2]], rotation: 0},
    ];
    const tile = {corners: [[1], [1], [0], [0]], rotation: 0};
    expect(board.canConnect(tiles, tile, 0, 0)).toBe(false);
  });

  it('returns catalysts', () => {
    const tiles = [
      {
        i: 0, j: 0,
        corners: [[1], [0], [1], [2]],
        rotation: 0,
      },
      {
        i: 0, j: 1,
        corners: [[0], [0], [1], [4, 5]],
        rotation: 0,
      },
      {
        i: 1, j: 0,
        corners: [[2], [1], [3], [0]],
        rotation: 0,
      },
    ];

    // 1 0 | 0   0
    // 2 1 | 4,5 1
    // - -
    // 2 1   0   1
    // 0 3   2   0

    const tile1 = {corners: [[0], [1], [0], [2]], rotation: 0};
    expect(board.getCatalysts(tiles, tile1, 1, 1)).toEqual([3]);

    // 1 0 | 0   0
    // 2 1 | 4,5 1
    // - -
    // 2 1   1   5
    // 0 3   2   0

    const tile2 = {corners: [[1], [5], [0], [2]], rotation: 0};
    expect(board.getCatalysts(tiles, tile2, 1, 1)).toEqual([3, 4, 5, 5]);
  });

  it('returns multiple activated catalysts of a same type', () => {
    const tiles = [
      {
        i: 0, j: 0,
        corners: [[1], [0], [1], [2]],
        rotation: 0,
      },
      {
        i: 0, j: 1,
        corners: [[0], [0], [4], [1]],
        rotation: 0,
      },
      {
        i: 1, j: 0,
        corners: [[2], [1], [2], [0]],
        rotation: 0,
      },
    ];

    // 1 0 | 0 0
    // 2 1 | 1 4
    // - -
    // 2 1   3 1
    // 0 2   2 0
    const tile1 = {corners: [[3], [1], [0], [2]], rotation: 0};
    expect(board.getCatalysts(tiles, tile1, 1, 1)).toEqual([3, 4]);

    // 1 0 | 0 0
    // 2 1 | 1 4
    // - -
    // 2 1   1 1
    // 0 2   4 0
    const tile2 = {corners: [[1], [1], [0], [4]], rotation: 0};
    expect(board.getCatalysts(tiles, tile2, 1, 1)).toEqual([4, 4]);
  });

  it('treats "big" tiles catalysts as one catalyst', () => {
    const tiles = [
      {
        i: 0, j: 0,
        corners: [[1], [1], [2], [2]],
        rotation: 0,
      },
    ];

    const tile = {corners: [[2,5],[2,5],[2,5],[2,5]], rotation: 0};
    expect(board.getCatalysts(tiles, tile, 1, 0)).toEqual([5]);
  });

  it('returns catalysts activated by "big" tiles', () => {
    const tiles = [
      {i: 0, j: 0, corners: [[1], [1], [2], [3]], rotation: 0},
    ];

    const tile = {corners: [[2,5],[2,5],[2,5],[2,5]], rotation: 0};
    expect(board.getCatalysts(tiles, tile, 1, 0)).toEqual([3, 5]);
  });

  it('returns free positions', () => {
    const tiles = [
      {
        i: 0, j: 0,
        corners: [[2], [2], [1], [1]],
        rotation: 0,
      },
      {
        i: 1, j: 0,
        corners: [[2], [2], [1], [1]],
        rotation: 0,
      },
    ];

    expect(board.getFreePositions(tiles)).toEqual([
      {i: 0, j: 1},
      {i: -1, j: 0},
      {i: 0, j: -1},
      {i: 2, j: 0},
      {i: 1, j: 1},
      {i: 1, j: -1},
    ]);
  });

  it('returns possible connections', () => {
    const tiles = [
      {
        i: 0, j: 0,
        corners: [[2], [2], [1], [1]],
        rotation: 0,
      },
    ];

    // 2 2
    // 1 1

    const corners = [[1], [0], [1], [0]];

    expect(board.getPossibleConnections(tiles, {
      corners,
      ...{rotation: 0},
    })).toEqual([
      {i: 1, j: 0},
      {i: 0, j: -1},
    ]);

    expect(board.getPossibleConnections(tiles, {
      corners,
      ...{rotation: 1},
    })).toEqual([
      {i: 1, j: 0},
      {i: 0, j: 1},
    ]);
  });

  it('returns board corners', () => {
    const tiles = [
      {
        id: 1,
        i: 0, j: 0,
        corners: [[1], [1], [3], [1]],
        rotation: 0,
      },
      {
        id: 2,
        i: 1, j: 1,
        corners: [[1], [1], [3], [1]],
        rotation: 0,
      },
      {
        id: 3,
        i: 0, j: 1,
        corners: [[1], [1], [3], [1]],
        rotation: 1,
      },
    ];

    expect(board.getCorners(tiles)).toEqual([
      {i: 0, j: 0, micropul: 1, corner: 0, tile: {id: 1, i: 0, j: 0}},
      {i: 0, j: 1, micropul: 1, corner: 1, tile: {id: 1, i: 0, j: 0}},
      {i: 1, j: 1, micropul: null, corner: 2, tile: {id: 1, i: 0, j: 0}},
      {i: 1, j: 0, micropul: 1, corner: 3, tile: {id: 1, i: 0, j: 0}},

      {i: 2, j: 2, micropul: 1, corner: 0, tile: {id: 2, i: 1, j: 1}},
      {i: 2, j: 3, micropul: 1, corner: 1, tile: {id: 2, i: 1, j: 1}},
      {i: 3, j: 3, micropul: null, corner: 2, tile: {id: 2, i: 1, j: 1}},
      {i: 3, j: 2, micropul: 1, corner: 3, tile: {id: 2, i: 1, j: 1}},

      {i: 0, j: 2, micropul: 1, corner: 3, tile: {id: 3, i: 0, j: 1}},
      {i: 0, j: 3, micropul: 1, corner: 0, tile: {id: 3, i: 0, j: 1}},
      {i: 1, j: 3, micropul: 1, corner: 1, tile: {id: 3, i: 0, j: 1}},
      {i: 1, j: 2, micropul: null, corner: 2, tile: {id: 3, i: 0, j: 1}},
    ]);
  });

  it('returns micropul groups in a single tile', () => {
    const tiles = [
      {
        id: 1,
        i: 0, j: 0,
        corners: [[1], [1], [3], [1]],
      },
    ];

    // 1 1
    // 1 3

    expect(board.getGroup(tiles, 0, 0, 0)).toEqual([
      {i: 0, j: 0, corner: 0},
      {i: 0, j: 0, corner: 1},
      {i: 0, j: 0, corner: 3},
    ]);

    expect(board.getGroup(tiles, 0, 0, 3)).toEqual([
      {i: 0, j: 0, corner: 3},
      {i: 0, j: 0, corner: 0},
      {i: 0, j: 0, corner: 1},
    ]);

    expect(board.getGroup(tiles, 0, 0, 2)).toEqual([]);
  });

  it('returns micropul groups with connections', () => {

    const tiles = [
      {
        i: 0, j: 0,
        corners: [[1], [1], [3], [1]],
      },
      {
        i: 0, j: 1,
        corners: [[1], [3], [2], [0]],
      },
      {
        i: 1, j: 1,
        corners: [[4], [2], [2], [0]],
      },
      {
        i: 1, j: 0,
        corners: [[1], [2], [5], [2]],
      },
    ];

    // 1 1 | 1 3
    // 1 3 | 0 2

    // - -   - -
    // 1 2 | 3 2
    // 2 5 | 0 2

    expect(board.getGroup(tiles, 0, 0, 0)).toEqual([
      {i: 0, j: 0, corner: 0},
      {i: 0, j: 0, corner: 1},
      {i: 0, j: 1, corner: 0},
      {i: 0, j: 0, corner: 3},
      {i: 1, j: 0, corner: 0},
    ]);

    expect(board.getGroup(tiles, 1, 1, 2)).toEqual([
      {i: 1, j: 1, corner: 2},
      {i: 1, j: 1, corner: 1},
      {i: 0, j: 1, corner: 2},
    ]);

    expect(board.getGroup(tiles, 1, 0, 1)).toEqual([
      {i: 1, j: 0, corner: 1},
    ]);
  });

  it('returns micropul groups of rotated tiles', () => {
    const tiles = [
      {i: 0, j: 0, rotation: 2, corners: [[1], [0], [0], [0]]},
      {i: 0, j: 1, rotation: 3, corners: [[1], [0], [3], [0]]},
      {i: 1, j: 0, rotation: 1, corners: [[1], [0], [0], [3]]},
      {i: 1, j: 1, rotation: 0, corners: [[1], [0], [1], [0]]},
    ];

    // 0 0 | 0 3
    // 0 1 | 1 0
    // - -   - -
    // 3 1 | 1 0
    // 0 0 | 0 1

    expect(board.getGroup(tiles, 1, 0, 0)).toEqual([
      {i: 1, j: 0, corner: 0},
      {i: 0, j: 0, corner: 0},
      {i: 0, j: 1, corner: 0},
      {i: 1, j: 1, corner: 0},
    ]);

    expect(board.getGroup(tiles, 1, 1, 2)).toEqual([
      {i: 1, j: 1, corner: 2},
    ]);
  });

  it('determines a closed group', () => {
    const tiles = [
      {
        i: 0, j: 0,
        rotation: 2,
        corners: [[1], [0], [0], [0]],
      },
      {
        i: 0, j: 1,
        rotation: 3,
        corners: [[1], [0], [3], [0]],
      },
      {
        i: 1, j: 0,
        rotation: 1,
        corners: [[1], [0], [0], [3]],
      },
      {
        i: 1, j: 1,
        rotation: 0,
        corners: [[1], [0], [1], [0]],
      },
    ];

    // 0 0 | 0 3
    // 0 1 | 1 0
    // - -   - -
    // 3 1 | 1 0
    // 0 0 | 0 1

    const openGroup = board.getGroup(tiles, 1, 1, 2);
    expect(board.isGroupClosed(tiles, openGroup)).toBe(false);

    const closedGroup = board.getGroup(tiles, 0, 0, 0);
    expect(board.isGroupClosed(tiles, closedGroup)).toBe(true);
  });

  it('returns possible stone places', () => {
    const tiles = [
      {
        id: 1,
        i: 0, j: 0,
        corners: [[1], [1], [3], [1]],
      },
      {
        id: 2,
        i: 0, j: 1,
        corners: [[1], [3], [2], [0]],
      },
      {
        id: 3,
        i: 1, j: 0,
        corners: [[1], [2], [5], [2]],
      },
    ];

    // (1) 1 | 1 3
    // 1   3 | 0 2
    // -   -
    // 1   2
    // 2   5

    expect(board.getPossibleStonePlaces(tiles, [{i: 0, j: 0, corner: 0}])).toEqual([
      {i: 1, j: 3, micropul: 2, corner: 2, tile: {id: 2, i: 0, j: 1}},
      {i: 2, j: 1, micropul: 2, corner: 1, tile: {id: 3, i: 1, j: 0}},
      {i: 3, j: 0, micropul: 2, corner: 3, tile: {id: 3, i: 1, j: 0}},
    ]);
  });

  it('gets stones coordinates', () => {
    const tiles = [
      {i: 0, j: 0, rotation: 0},
      {i: 0, j: 1, rotation: 1},
      {i: 1, j: 0, rotation: 0},
    ];

    const stones = [
      {i: 0, j: 0, corner: 0},
      {i: 0, j: 1, corner: 0},
    ];

    expect(board.getStonesCoords(tiles, stones)).toEqual([
      {i: 0, j: 0, corner: 0},
      {i: 0, j: 3, corner: 0},
    ]);
  });

});
