export function canConnect(tiles, tile, i, j) {
  return 0 < getConnectionTiles(tiles, tile, i, j).reduce((cost, def) => {
    return cost + getSideConnectionCost(def.tile, tile, def.side);
  }, 0);
}

export function getPowerups(tiles, tile, i, j) {
  const powerups = getConnectionTiles(tiles, tile, i, j).reduce((powerups, def) => {
    const cornersA = getTileSideCorners(def.tile, def.side);
    const cornersB = getTileSideCorners(tile, getOppositeSide(def.side)).reverse();

    cornersA.forEach((cornerA, i) => {
      const cornerB = cornersB[i];
      const aMicropuls = getCornerMicropuls(cornerA);
      const bMicropuls = getCornerMicropuls(cornerB);
      const aPowerups = getCornerPowerups(cornerA);
      const bPowerups = getCornerPowerups(cornerB);

      if (aMicropuls.length > 0 && bPowerups.length > 0) {
        powerups.push(...bPowerups);
      } else if(bMicropuls.length > 0 && aPowerups.length > 0) {
        powerups.push(...aPowerups);
      }
    });

    return powerups;
  }, []).sort();

  return [...new Set(powerups)];
}

function getConnectionTiles(tiles, tile, i, j) {
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

  if (a === b && a > 0) {
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

function getCornerPowerups(corner) {
  return corner.filter((x) => {
    return [3, 4, 5].indexOf(x) !== -1;
  });
}

/*
 * SIDES
 *       0
 *   .-------.
 *   |       |
 * 3 |       | 1
 *   |       |
 *   ._______.
 *       2
 *
 * CORNER TYPES
 * 0 - nothing
 * 1 - white micropul
 * 2 - black micropul
 * 3 - draw 1
 * 4 - draw 2
 * 5 - play again
 */
const inverse = {1: 2, 2: 1};
export const possibleTiles = [
  [[1], [0], [0], [0]],
  [[1], [2], [0], [5]],
  [[5], [1], [2], [1]],
  [[1], [0], [3], [0]],
  [[1], [2], [3], [0]],
  [[3], [1], [2], [1]],
  [[1], [0], [0], [3]],
  [[1], [1], [3], [0]],
  [[1], [1], [1], [3]],
  [[1], [3], [0], [5]],
  [[1], [1], [0], [4]],
  [[1], [1], [2], [4]],
  [[1], [3], [3], [0]],
  [[1], [0], [1], [0]],
  [[1], [1], [2], [1]],
  [[1], [4], [3], [0]],
  [[1], [0], [2], [3]],
  [[1], [2], [1], [2]],
  [[1], [5], [1], [3]],
  [[1], [1], [2], [2]],
  [[1], [3], [2], [3]],
  [[1], [1], [1], [1]],
  [[1, 5], [1, 5], [1, 5], [1, 5]],
  [[1, 3], [1, 3], [1, 3], [1, 3]],
].reduce((acc, tile) => {
  acc.push(tile);
  acc.push(tile.map((edges) => {
    return edges.map((edge) => {
      if (typeof(inverse[edge]) !== 'undefined') {
        return inverse[edge];
      }

      return edge;
    });
  }));

  return acc;
}, []);
