import * as game from '../../src/domain/game';

describe('Game', () => {

  it('returns 48 possible tiles', () => {
    expect(game.possibleTiles.length).toBe(48);
  });

  it('rotates tile', () => {

    const corners = [[1], [2], [3], [4]];

    expect(game.rotateCorners(corners, 0)).toEqual(corners);
    expect(game.rotateCorners(corners, 1)).toEqual([[4], [1], [2], [3]]);
    expect(game.rotateCorners(corners, 2)).toEqual([[3], [4], [1], [2]]);
    expect(game.rotateCorners(corners, 3)).toEqual([[2], [3], [4], [1]]);
    expect(game.rotateCorners(corners, 4)).toEqual(corners);

  });

  it('gets corners side corners', () => {

    const corners = [[1], [2], [3], [4]];

    expect(game.getSideCorners(corners, 0)).toEqual([[1], [2]]);
    expect(game.getSideCorners(corners, 1)).toEqual([[2], [3]]);
    expect(game.getSideCorners(corners, 2)).toEqual([[3], [4]]);
    expect(game.getSideCorners(corners, 3)).toEqual([[4], [1]]);
    expect(game.getSideCorners(corners, 4)).toEqual([[1], [2]]);

  });

  it('connects tiles with same colors', () => {

    const tiles = [
      {
        corners: [[0], [0], [1], [1]],
        connections: [null, null, null, null],
        rotation: 0,
      },
    ];

    const tile = {
      corners: [[1], [1], [0], [0]],
      rotation: 0,
    };

    // 1 1
    // 0 0
    // + +
    // 0 0
    // 1 1
    expect(game.canConnect(tiles, tile, 0, 0)).toBe(false);

    // 0 0 + 1 1
    // 1 1 + 0 0
    expect(game.canConnect(tiles, tile, 0, 1)).toBe(false);

    // 0 0
    // 1 1
    // + +
    // 1 1
    // 0 0
    expect(game.canConnect(tiles, tile, 0, 2)).toBe(true);

    // 1 1 + 0 0
    // 0 0 + 1 1
    expect(game.canConnect(tiles, tile, 0, 3)).toBe(false);

  });

  it('do not connects tiles with different colors', () => {

    const tiles = [{
      corners: [[1], [0], [1], [2]],
      connections: [null, null, null, null],
      rotation: 0,
    }];

    const tile = {
      corners: [[1], [1], [2], [0]],
      rotation: 0,
    };

    // 1 0
    // 2 1
    // + +
    // 1 1
    // 0 2
    expect(game.canConnect(tiles, tile, 0, 2)).toBe(false);

    // 1 1 + 1 0
    // 0 2 + 2 1
    expect(game.canConnect(tiles, tile, 0, 3)).toBe(true);

  });

  it('connects tiles with rotation', () => {

    const tiles = [{
      corners: [[1], [0], [1], [2]],
      connections: [null, null, null, null],
      rotation: 0,
    }];

    const corners = [[1], [1], [2], [0]];

    // 1 0
    // 2 1
    // + +
    // 0 1   1 1 -> rotation 1
    // 2 1   0 2
    expect(game.canConnect(tiles, {corners, rotation: 1}, 0, 2)).toBe(true);

    // 1 0
    // 2 1
    // + +
    // 2 0   1 1 -> rotation 2
    // 1 1   0 2
    expect(game.canConnect(tiles, {corners, rotation: 2}, 0, 2)).toBe(true);

    // 1 0
    // 2 1
    // + +
    // 1 0   1 1 -> rotation 3
    // 1 2   0 2
    expect(game.canConnect(tiles, {corners, rotation: 3}, 0, 2)).toBe(false);

  });

});
