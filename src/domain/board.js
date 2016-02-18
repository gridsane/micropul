export function canConnect(tiles, tile, i, j) {
  return 0 < getConnectionTiles(tiles, i, j).reduce((cost, def) => {
    return cost + getSideConnectionCost(def.tile, tile, def.side);
  }, 0);
}

export function getCatalysts(tiles, tile, i, j) {
  const catalysts = getConnectionTiles(tiles, i, j).reduce((catalysts, def) => {
    const cornersA = getTileSideCorners(def.tile, def.side);
    const cornersB = getTileSideCorners(tile, getOppositeSide(def.side)).reverse();

    cornersA.forEach((cornerA, i) => {
      const cornerB = cornersB[i];
      const aMicropuls = getCornerMicropuls(cornerA);
      const bMicropuls = getCornerMicropuls(cornerB);
      const aCatalysts = getCornerCatalysts(cornerA);
      const bCatalysts = getCornerCatalysts(cornerB);

      if (aMicropuls.length > 0 && bCatalysts.length > 0) {
        catalysts.push(...bCatalysts);
      } else if(bMicropuls.length > 0 && aCatalysts.length > 0) {
        catalysts.push(...aCatalysts);
      }
    });

    return catalysts;
  }, []).sort();

  return [...new Set(catalysts)];
}

export function getFreePositions(tiles) {
  const occupied = tiles.map((tile) => {
    return posHash(tile.i, tile.j);
  });

  return tiles.reduce((free, tile) => {
    const {i, j} = tile;
    [1, -1].forEach((d) => {
      const ih = posHash(i + d, j);
      const jh = posHash(i, j + d);

      if (occupied.indexOf(ih) === -1) {
        free.push({i: i + d, j});
        occupied.push(ih);
      }

      if (occupied.indexOf(jh) === -1) {
        free.push({i, j: j + d});
        occupied.push(jh);
      }
    });

    return free;
  }, []);
}

export function getPossibleConnections(tiles, tile) {
  const free = getFreePositions(tiles);

  return free.reduce((possible, pos) => {
    if (canConnect(tiles, tile, pos.i, pos.j)) {
      possible.push(pos);
    }

    return possible;
  }, []);
}

export function getCorners(tiles) {

  return tiles.reduce((acc, tile) => {
    const imap = [tile.i*2, tile.i*2, tile.i*2 + 1, tile.i*2 + 1];
    const jmap = [tile.j*2, tile.j*2 + 1, tile.j*2 + 1, tile.j*2];
    const rotation = tile.rotation || 0;
    rotateCorners(tile.corners, rotation).forEach((corner, cornerIndex) => {
      acc.push({
        i: imap[cornerIndex],
        j: jmap[cornerIndex],
        corner: getCornerIndex(cornerIndex - rotation),
        micropul: getCornerMicropuls(corner)[0] || null,
        tile: {id: tile.id, i: tile.i, j: tile.j},
      });
    });

    return acc;
  }, []);
}

export function getGroup(tiles, i, j, cornerIndex) {
  const corners = getCorners(tiles);
  const corner = corners.find((c) => c.tile.i === i && c.tile.j === j && c.corner === cornerIndex);

  return Object.values(getCornerGroup(corners, corner, {}));
}

function getCornerGroup(corners, corner, group) {
  [{di: 1, dj: 0},
  {di: 0, dj: 1},
  {di: -1, dj: 0},
  {di: 0, dj: -1}].forEach((d) => {
    const pos = {i: corner.i + d.di, j: corner.j + d.dj};
    const hash = posHash(pos.i, pos.j);
    const targetCorner = corners.find((c) => c.i === pos.i && c.j === pos.j && c.micropul === corner.micropul && c.micropul !== null);
    if (targetCorner && !group[hash]) {
      group[hash] = {
        i: targetCorner.tile.i,
        j: targetCorner.tile.j,
        corner: targetCorner.corner,
      };
      group = getCornerGroup(corners, targetCorner, group);
    }
  });

  return group;
}

function getCornerIndex(index) {
  // @todo use function from 'utils'
  if (index < 0) {
    return 4 + index;
  }

  if (index > 3) {
    return index - 4;
  }

  return index;
}

function posHash(i, j) {
  return i + '_' + j;
}

function getConnectionTiles(tiles, i, j) {
  return tiles.reduce((affectedTiles, t) => {
    let side = null;

    if (t.i === i - 1 && t.j === j) {
      side = 2;
    }
    if (t.i === i + 1 && t.j === j) {
      side = 0;
    }
    if (t.i === i && t.j === j - 1) {
      side = 1;
    }
    if (t.i === i && t.j === j + 1) {
      side = 3;
    }

    if (side !== null) {
      affectedTiles.push({tile: t, side});
    }

    return affectedTiles;
  }, []);
}

function getSideConnectionCost(tileA, tileB, side) {
  const cornersA = getTileSideCorners(tileA, side);
  const cornersB = getTileSideCorners(tileB, getOppositeSide(side)).reverse();

  const cost = cornersA.map((corner, i) => {
    return getConnectionCost(corner, cornersB[i]);
  }).reduce((cost, connectionCost) => {
    return cost + connectionCost;
  }, 0);

  return cost;
}

function getConnectionCost(cornerA, cornerB) {
  const [a, b] = [cornerA[0], cornerB[0]];

  if (a === b && b > 0 && b < 3) {
    return 1;
  }

  if (a >= 3 || b >= 3 || a === 0 || b === 0) {
    return 0;
  }

  return -Infinity;
}

function getOppositeSide(side) {
  const oppositeSide = side + 2;
  if (oppositeSide > 3) {
    return oppositeSide - 4;
  }

  return oppositeSide;
}

function getTileSideCorners(tile, side) {
  return getSideCorners(rotateCorners(tile.corners, tile.rotation), side);
}

export function getSideCorners(corners, side) {
  const c = corners;
  c.push(c[0]);
  c.push(c[1]);

  return c.slice(side, side + 2);
}

export function rotateCorners(corners, rotation) {
  const result = [...corners];
  for (var i = rotation; i > 0; i--) {
    const a = result.pop();
    result.unshift(a);
  }

  return result;
}

function getCornerMicropuls(corner) {
  return corner.filter((x) => {
    return [1, 2].indexOf(x) !== -1;
  });
}

function getCornerCatalysts(corner) {
  return corner.filter((x) => {
    return [3, 4, 5].indexOf(x) !== -1;
  });
}

/*
 * SIDES & corners
 *       0
 *   .-------.
 *   | 0   1 |
 * 3 |       | 1
 *   | 3   2 |
 *   ._______.
 *       2
 *
 * CORNER TYPES
 * 0 - nothing
 * 1 - micropul type 1
 * 2 - micropul type 2
 * -- catalysts
 * 3 - refill supply by 1 tile (1 dot)
 * 4 - refill supply by 2 tiles (2 dots)
 * 5 - take extra turn (plus sign)
 */
const inverse = {1: 2, 2: 1};
export const possibleTiles = [
  [[1], [1], [2], [2]], // 0
  [[1], [0], [0], [0]], // 2
  [[1], [2], [0], [5]], // 4
  [[5], [1], [2], [1]], // 6
  [[1], [0], [3], [0]], // 8
  [[1], [2], [3], [0]], // 10
  [[3], [1], [2], [1]], // 12
  [[1], [0], [0], [3]], // 14
  [[1], [1], [3], [0]], // 16
  [[1], [1], [1], [3]], // 18
  [[1], [3], [0], [5]], // 20
  [[1], [1], [0], [4]], // 22
  [[1], [1], [2], [4]], // 24
  [[1], [3], [3], [0]], // 26
  [[1], [0], [1], [0]], // 28
  [[1], [1], [2], [1]], // 30
  [[1], [4], [3], [0]], // 32
  [[1], [0], [2], [3]], // 34
  [[1], [2], [1], [2]], // 36
  [[1], [5], [1], [3]], // 38
  [[1], [3], [2], [3]], // 40
  [[1], [1], [1], [1]], // 42
  [[1, 5], [1, 5], [1, 5], [1, 5]], // 44
  [[1, 3], [1, 3], [1, 3], [1, 3]], // 46
].reduce((acc, corners, i) => {
  acc.push({id: ((i + 1) * 2) - 2, corners});
  acc.push({id: (i + 1) * 2 - 1, corners: corners.map((edges) => {
    return edges.map((edge) => {
      if (typeof(inverse[edge]) !== 'undefined') {
        return inverse[edge];
      }

      return edge;
    });
  })});

  return acc;
}, []);
