import reducer from '../../src/reducers/game';
import * as actions from '../../src/actions/game';

describe('Game reducer', () => {

  it('adds tiles', () => {

    const initialState = {
      board: [{
        id: 1,
        i: 0, j: 0,
        corners: [[1], [0], [1], [0]],
        rotation: 0,
      }],
      hand: [{
        id: 2,
        i: 1, j: 0,
        corners: [[1], [0], [1], [0]],
        rotation: 0,
      }],
    };

    const state = reducer(initialState, actions.boardAddTile(initialState.hand[0]));

    expect(state).toEqual({
      hand: [],
      board: [
        {
          id: 1,
          i: 0, j: 0,
          corners: [[1], [0], [1], [0]],
          rotation: 0,
        },
        {
          id: 2,
          i: 1, j: 0,
          corners: [[1], [0], [1], [0]],
          rotation: 0,
        },
      ],
    });

  });

});
