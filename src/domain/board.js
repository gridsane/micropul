export function canConnect(tiles, tile, i, j) {
  const costsSum = tiles.reduce((cost, t) => {

    if (t.i === i - 1 && t.j === j) {
      return cost + getSideConnectionCost(t, tile, 2);
    }
    if (t.i === i + 1 && t.j === j) {
      return cost + getSideConnectionCost(t, tile, 0);
    }
    if (t.i === i && t.j === j - 1) {
      return cost + getSideConnectionCost(t, tile, 1);
    }
    if (t.i === i && t.j === j + 1) {
      return cost + getSideConnectionCost(t, tile, 3);
    }

    return cost;
  }, 0);

  return costsSum > 0;
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
