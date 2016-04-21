import * as utils from '../../src/utils';

describe('Utils', () => {
  it('gets array element by rotated index', () => {
    expect(utils.atIndex([1, 2], -3)).toBe(2);
    expect(utils.atIndex([1, 2], -2)).toBe(1);
    expect(utils.atIndex([1, 2], -1)).toBe(2);
    expect(utils.atIndex([1, 2], 0)).toBe(1);
    expect(utils.atIndex([1, 2], 1)).toBe(2);
    expect(utils.atIndex([1, 2], 2)).toBe(1);
    expect(utils.atIndex([1, 2], 3)).toBe(2);
    expect(utils.atIndex([], 0)).toBe(undefined);
    expect(utils.atIndex([], 99)).toBe(undefined);
  });
});
