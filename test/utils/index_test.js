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

  it('binds object methods @now', () => {
    const obj = {
      foo: {bind: expect.createSpy().andCall(() => obj.foo)},
      bar: {bind: expect.createSpy().andCall(() => obj.bar)},
      baz: {bind: expect.createSpy().andCall(() => 'bound_baz')},
      quux: {bind: expect.createSpy()},
    };

    utils.bindMethods(obj, ['foo', 'bar', 'baz']);

    expect(obj.foo.bind).toHaveBeenCalledWith(obj);
    expect(obj.bar.bind).toHaveBeenCalledWith(obj);
    expect(obj.baz).toBe('bound_baz');
    expect(obj.quux.bind).toNotHaveBeenCalled();

  });

});
