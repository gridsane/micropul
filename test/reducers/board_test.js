import reducer from '../../src/reducers/board';
import * as actions from '../../src/actions/board';

describe('Board reducer', () => {

  it('adds tiles', () => {

    const initialState = [
      {
        i: 0, j: 0,
        corners: [[1], [0], [1], [0]],
        rotation: 0,
      },
    ];

    const state = reducer(initialState, actions.addTile({
      i: 1, j: 0,
      corners: [[1], [0], [1], [0]],
      rotation: 0,
    }));

    expect(state).toEqual([
      {
        i: 0, j: 0,
        corners: [[1], [0], [1], [0]],
        rotation: 0,
      },
      {
        i: 1, j: 0,
        corners: [[1], [0], [1], [0]],
        rotation: 0,
      },
    ]);

  });

});
