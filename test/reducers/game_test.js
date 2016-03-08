import reducer from '../../src/reducers/game';
import * as actions from '../../src/actions/game';

describe('Game reducer', () => {

  it('starts the game', () => {
    const state = reducer({
      playerId: 'id1',
      isFinished: true,
    }, actions.start(['id1', 'id2']));

    expect(state.gameId).toNotBe(null);
    expect(state.players.length).toBe(2);
    expect([...new Set(state.players[0].hand)].length).toBe(6);
    expect([...new Set(state.players[1].hand)].length).toBe(6);
    expect(state.players[0].supply).toBe(0);
    expect(state.players[1].supply).toBe(0);
    expect(state.turnQueue).toEqual(['id1']);
    expect(state.board.length).toBe(1);
    expect(state.startedAt).toNotBe(null);
    expect(state.updatedAt).toNotBe(null);
    expect(state.playerId).toBe('id1');
    expect(state.isFinished).toBe(false);
  });

  it('places a stone', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));
    const nextState = reducer(startState, actions.placeStone('id1', 0, 0, 1));

    const player = nextState.players.find((p) => p.id === 'id1');
    expect(player.stones).toEqual([{i: 0, j: 0, corner: 1}]);
    expect(nextState.turnQueue).toEqual(['id2']);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('do not places a stone out of turn', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));
    const nextState = reducer(startState, actions.placeStone('id2', 0, 0, 1));
    expect(startState).toEqual(nextState);
  });

  it('do not places a stone in a occupied group', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));
    let nextState = reducer(startState, actions.placeStone('id1', 0, 0, 1));

    expect(nextState.players[0].stones).toEqual([{i: 0, j: 0, corner: 1}]);

    nextState = reducer(nextState, actions.placeStone('id2', 0, 0, 0));
    expect(nextState.players[1].stones).toEqual([]);
    expect(nextState.turnQueue).toEqual(['id2']);
  });

  it('connects a tile', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 2, rotation: 0}]; // corners: [1, 0, 0, 0]
    startState.players[1].hand = [];

    const nextState = reducer(startState, actions.connectTile('id1', 2, 0, 0, 1));

    expect(nextState.board).toEqual([
      {id: 0, i: 0, j: 0, rotation: 0},
      {id: 2, i: 0, j: 1, rotation: 0},
    ]);
    expect(nextState.turnQueue).toEqual(['id2']);
    expect(nextState.players[0].hand.length).toBe(0);
    expect(nextState.players[0].supply).toBe(0);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('do not connects a tile, if it not possible', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 2, rotation: 0}]; // corners: [1, 0, 0, 0]
    startState.players[1].hand = [];

    const nextState = reducer(startState, actions.connectTile('id1', 2, 0, 1, 0));
    expect(nextState).toBe(startState);
  });

  it('do not connects a tile out of turn', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 2, rotation: 0}]; // [[1], [1], [2], [2]]
    startState.players[1].hand = [{id: 3, rotation: 0}]; // [[2], [2], [1], [1]]

    const nextState = reducer(startState, actions.connectTile('id2', 3, 0, 1, 0));
    expect(nextState).toBe(startState);
  });

  it('do not connects a tile if player does not have it', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 3, rotation: 0}]; // [[2], [2], [1], [1]]
    startState.players[1].hand = [];

    const nextState = reducer(startState, actions.connectTile('id1', 2, 0, 0, 1));
    expect(nextState).toBe(startState);
  });

  it('applies \'extra turn\' catalyst', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 4, rotation: 0}]; // [[1], [2], [0], [5]]
    startState.players[1].hand = [];

    const nextState = reducer(startState, actions.connectTile('id1', 4, 0, 0, 1));
    expect(nextState.turnQueue).toEqual(['id1']);
    expect(nextState.board.length).toBe(2);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('applies \'refill supply by 1\' catalyst', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 10, rotation: 0}]; // [[1], [2], [3], [0]]
    startState.players[1].hand = [];

    const nextState = reducer(startState, actions.connectTile('id1', 10, 3, 1, 0));
    expect(nextState.turnQueue).toEqual(['id2']);
    expect(nextState.board.length).toBe(2);
    expect(nextState.players[0].supply).toBe(1);
    expect(nextState.players[1].supply).toBe(0);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('applies \'refill supply by 2\' catalyst', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 22, rotation: 0}]; // [[1], [1], [0], [4]]
    startState.players[1].hand = [];

    const nextState = reducer(startState, actions.connectTile('id1', 22, 0, 0, 1));
    expect(nextState.turnQueue).toEqual(['id2']);
    expect(nextState.board.length).toBe(2);
    expect(nextState.players[0].supply).toBe(2);
    expect(nextState.players[1].supply).toBe(0);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('applies multiple "refill supply" catalysts', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 43, rotation: 0}, {id: 27, rotation: 3}];
    startState.players[1].hand = [{id: 36, rotation: 0}];

    // (0)
    // 1 1 | 1 2 (36)
    // 2 2 | 2 1
    // - -
    // 2 2   3 3  (27, rotation: 3)
    // 2 2   2 0
    // (43)

    let nextState = reducer(startState, actions.connectTile('id1', 43, 0, 1, 0));
    nextState = reducer(nextState, actions.connectTile('id2', 36, 0, 0, 1));
    expect(nextState.players[0].supply).toBe(0);
    expect(nextState.players[1].supply).toBe(0);

    nextState = reducer(nextState, actions.connectTile('id1', 27, 3, 1, 1));
    expect(nextState.board.length).toBe(4);
    expect(nextState.players[0].supply).toBe(2);
    expect(nextState.players[1].supply).toBe(0);
  });

  it('applies multiple "extra turn" catalysts', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 34, rotation: 0}, {id: 21, rotation: 1}];
    startState.players[1].hand = [{id: 7, rotation: 0}];

    // 2 1 0 5 // 5
    // (0) 1 1 | 1 0 (34)
    //     2 2 | 3 2
    //           - -
    //     5 2   5 2 (7)
    //     0 3   2 1
    // (21, rotation: 1)

    let nextState = reducer(startState, actions.connectTile('id1', 34, 0, 0, 1));
    expect(nextState.board.length).toBe(2);
    nextState = reducer(nextState, actions.connectTile('id2', 7, 0, 1, 1));
    expect(nextState.board.length).toBe(3);

    nextState = reducer(nextState, actions.connectTile('id1', 21, 1, 1, 0));
    expect(nextState.board.length).toBe(4);
    expect(nextState.turnQueue).toEqual(['id1', 'id1']);
  });

  it('follows turn queue', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));
    startState.players[0].supply = 2;
    startState.turnQueue = ['id1', 'id1'];

    let nextState = reducer(startState, actions.refillHand('id1', 1));
    expect(nextState.turnQueue).toEqual(['id1']);
    expect(nextState.players[0].supply).toBe(1);

    nextState = reducer(nextState, actions.refillHand('id1', 1));
    expect(nextState.turnQueue).toEqual(['id2']);
    expect(nextState.players[0].supply).toBe(0);
  });

  it('refills supply with not greater count then available tiles', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    startState.players[0].hand = (new Array(24)).fill(1).map((_, i) => {
      return {id: i + 1, rotation: 0};
    });
    startState.players[0].supply = 1;
    startState.players[1].hand = (new Array(21)).fill(1).map((_, i) => {
      return {id: i + 25, rotation: 0};
    });

    // free tiles is 1 (1 on the board, 45 on hands, 1 in the first player supply)
    // 1 1 | 1 1 (22)
    // 2 2 | 4 0

    const nextState = reducer(startState, actions.connectTile('id1', 22, 0, 0, 1));
    expect(nextState.players[0].supply).toBe(2);

  });

  it('refills a hand', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].supply = 2;

    const nextState = reducer(startState, actions.refillHand('id1', 2));
    expect(nextState.players[0].supply).toBe(0);
    expect([...new Set(nextState.players[0].hand)].length).toBe(8);
    expect(nextState.turnQueue).toEqual(['id2']);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('do not refills a hand out of turn', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[1].supply = 2;

    const nextState = reducer(startState, actions.refillHand('id2', 2));
    expect(nextState).toBe(startState);
  });

  it('refills a hand with not greater count then supply', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].supply = 1;

    const nextState = reducer(startState, actions.refillHand('id1', 2));
    expect(nextState.players[0].supply).toBe(0);
    expect([...new Set(nextState.players[0].hand)].length).toBe(7);
  });

  it('do not skips turn if there are no supply when refilling a hand', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));
    const nextState = reducer(startState, actions.refillHand('id1', 1));
    expect(nextState).toBe(startState);
  });

  it('skips turn', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));
    const nextState = reducer(startState, actions.skipTurn('id1'));
    expect(nextState.turnQueue).toEqual(['id2']);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('do not skips turn out of turn', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));
    const nextState = reducer(startState, actions.skipTurn('id2'));
    expect(nextState).toBe(startState);
  });

  it('partially merges state', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));
    const nextState = reducer(startState, actions.mergeState({
      turnQueue: ['id2'],
    }));

    expect(nextState).toNotBe(startState);
    expect(nextState.turnQueue).toEqual(['id2']);
    expect({...nextState, turnQueue: ['id1']}).toEqual({...startState, turnQueue: ['id1']});
  });

  it('finishes a game when last tile connected', () => {
    const startState = reducer(undefined, actions.start(['id1', 'id2']));

    startState.board = (new Array(46)).fill(1).map((_, i) => {
      return {id: i, i: -i, j: 0, rotation: 0};
    });

    startState.players[0].hand = [{id: 47, rotation: 0}];

    const nextState = reducer(startState, actions.connectTile('id1', 47, 0, 1, 0));
    expect(nextState.players[0].hand.length).toBe(0);
    expect(nextState.isFinished).toBe(true);
  });

  // @todo: calculates a score when game was finished
  // @todo: logs actions, including tiles sequences and start state

});
