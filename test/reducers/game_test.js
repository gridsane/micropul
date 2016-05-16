import reducer from '../../src/reducers/game';
import * as actions from '../../src/actions/game';

describe('Game reducer', () => {

  it('starts the game', () => {
    const state = reducer({
      playerId: 'id1',
      isFinished: true,
    }, actions.start('game_id', ['id1', 'id2']));

    expect(state.gameId).toBe('game_id');
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
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    const nextState = reducer(startState, actions.placeStone('id1', 0, 1));

    const player = nextState.players.find((p) => p.id === 'id1');
    expect(player.stones).toEqual([{i: 0, j: 0, corner: 1}]);
    expect(nextState.turnQueue).toEqual(['id2']);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('do not places a stone out of turn', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    const nextState = reducer(startState, actions.placeStone('id2', 0, 1));
    expect(startState).toEqual(nextState);
  });

  it('do not places a stone in a occupied group', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    let nextState = reducer(startState, actions.placeStone('id1', 0, 1));

    expect(nextState.players[0].stones).toEqual([{i: 0, j: 0, corner: 1}]);

    nextState = reducer(nextState, actions.placeStone('id2', 0, 0));
    expect(nextState.players[1].stones).toEqual([]);
    expect(nextState.turnQueue).toEqual(['id2']);
  });

  it('does not allow to place more than 3 stones', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    startState.board = [
      ...startState.board,
      {id: 28, i: 0, j: 1}, // 1 0 1 0
      {id: 29, i: 1, j: 0}, // 2 0 2 0
    ];

    startState.players[0].stones = [
      {i: 0, j: 0, corner: 0},
      {i: 0, j: 0, corner: 2},
      {i: 1, j: 0, corner: 2},
    ];

    const nextState = reducer(startState, actions.placeStone('id1', 28, 2));
    expect(nextState).toEqual(startState);
  });

  it('connects a tile', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

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
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 2, rotation: 0}]; // corners: [1, 0, 0, 0]
    startState.players[1].hand = [];

    const nextState = reducer(startState, actions.connectTile('id1', 2, 0, 1, 0));
    expect(nextState).toBe(startState);
  });

  it('do not connects a tile out of turn', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 2, rotation: 0}]; // [[1], [1], [2], [2]]
    startState.players[1].hand = [{id: 3, rotation: 0}]; // [[2], [2], [1], [1]]

    const nextState = reducer(startState, actions.connectTile('id2', 3, 0, 1, 0));
    expect(nextState).toBe(startState);
  });

  it('do not connects a tile if player does not have it', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 3, rotation: 0}]; // [[2], [2], [1], [1]]
    startState.players[1].hand = [];

    const nextState = reducer(startState, actions.connectTile('id1', 2, 0, 0, 1));
    expect(nextState).toBe(startState);
  });

  it('applies \'extra turn\' catalyst', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].hand = [{id: 4, rotation: 0}]; // [[1], [2], [0], [5]]
    startState.players[1].hand = [];

    const nextState = reducer(startState, actions.connectTile('id1', 4, 0, 0, 1));
    expect(nextState.turnQueue).toEqual(['id1']);
    expect(nextState.board.length).toBe(2);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('applies \'refill supply by 1\' catalyst', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

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
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

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
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

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
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

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
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
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
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

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
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].supply = 2;

    const nextState = reducer(startState, actions.refillHand('id1', 2));
    expect(nextState.players[0].supply).toBe(0);
    expect([...new Set(nextState.players[0].hand)].length).toBe(8);
    expect(nextState.turnQueue).toEqual(['id2']);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('do not refills a hand out of turn', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

    // fill hands with known tiles
    startState.players[1].supply = 2;

    const nextState = reducer(startState, actions.refillHand('id2', 2));
    expect(nextState).toBe(startState);
  });

  it('refills a hand with not greater count then supply', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

    // fill hands with known tiles
    startState.players[0].supply = 1;

    const nextState = reducer(startState, actions.refillHand('id1', 2));
    expect(nextState.players[0].supply).toBe(0);
    expect([...new Set(nextState.players[0].hand)].length).toBe(7);
  });

  it('do not skips turn if there are no supply when refilling a hand', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    const nextState = reducer(startState, actions.refillHand('id1', 1));
    expect(nextState).toBe(startState);
  });

  it('skips turn', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    const nextState = reducer(startState, actions.skipTurn('id1'));
    expect(nextState.turnQueue).toEqual(['id2']);
    expect(nextState.updatedAt).toNotBe(startState.updatedAt);
  });

  it('do not skips turn out of turn', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    const nextState = reducer(startState, actions.skipTurn('id2'));
    expect(nextState).toBe(startState);
  });

  it('partially merges state', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    const nextState = reducer(startState, actions.mergeState({
      turnQueue: ['id2'],
    }));

    expect(nextState).toNotBe(startState);
    expect(nextState.turnQueue).toEqual(['id2']);
    expect({...nextState, turnQueue: ['id1']}).toEqual({...startState, turnQueue: ['id1']});
  });

  it('finishes a game when last core tile drawn', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

    // player 1 has 30 tiles on hand and 6 tiles in supply
    // player 2 has 10 tiles including id:10
    // board has 1 tile
    // core has 1 tile

    startState.players[0].hand = (new Array(30)).fill(1).map((_, i) => ({id: i + 11, rotation: 0}));
    startState.players[0].supply = 6;
    startState.players[1].hand = (new Array(10)).fill(1).map((_, i) => ({id: i + 1, rotation: 0}));

    // 1 1 + 1 0 -> id:28, first turn, core still has 1 tile
    // 2 2 + 0 1
    // + +
    // 2 3 -> id:10, rotation: 3, second turn, core has no tiles, finish
    // 1 0

    let nextState = reducer(startState, actions.connectTile('id1', 28, 0, 0, 1));
    expect(nextState.isFinished).toBe(false);

    nextState = reducer(nextState, actions.connectTile('id2', 10, 3, 1, 0));
    expect(nextState.isFinished).toBe(true);
  });

  it('finishes a game when player has no tiles', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));

    startState.players[0].hand = [];
    startState.players[0].supply = 1;
    startState.players[1].hand = [{id: 1, rotation: 0}];

    // 1 1
    // 2 2
    // + +
    // 2 2
    // 1 1

    let nextState = reducer(startState, actions.refillHand('id1'));
    expect(nextState.isFinished).toBe(false);

    nextState = reducer(nextState, actions.connectTile('id2', 1, 0, 1, 0));
    expect(nextState.isFinished).toBe(true);
  });

  it('calculates a score when game was finished', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    startState.board = [
      {id: 8, i: 0, j: 1, rotation: 3}, // 1 0 3 0
      {id: 14, i: 1, j: 0, rotation: 1}, // 1 0 0 3
      {id: 28, i: 1, j: 1, rotation: 0}, // 1 0 1 0
    ];

    // board: 3 tiles
    // player1: 1 tile on hand, 21 tiles in supply
    // player2: 1 tile on hand, 21 tiles in supply
    // core: 1 tile

    startState.players[0].hand = [{id: 42, rotation: 2}], // 1 1 1 1
    startState.players[0].supply = 21;
    startState.players[0].stones = [{i: 1, j: 1, corner: 0}];

    startState.players[1].hand = [{id: 1, rotation: 0}];
    startState.players[1].supply = 21;
    startState.players[1].stones = [{i: 1, j: 1, corner: 2}];

    // 1 1 + 0   3
    // 1 1 + 1   0
    // + +   -   -
    // 3 1 | (1) 0
    // 0 0 | 0  (1)

    // player 1 finishes the game by placing last tile and gains 1 supply tile
    const nextState = reducer(startState, actions.connectTile('id1', 42, 0, 0, 0));
    expect(nextState.isFinished).toBe(true);
    expect(nextState.players[0].score).toBe(0/*group*/ + 44/*supply*/ + 0/*hand*/);
    expect(nextState.players[1].score).toBe(0/*group*/ + 42/*supply*/ + 1/*hand*/);
  });

  it('calculates a score based on closed groups', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    startState.board = [
      {id: 2, i: 0, j: 0, rotation: 2}, // 1 0 0 0
      {id: 8, i: 0, j: 1, rotation: 3}, // 1 0 3 0
      {id: 14, i: 1, j: 0, rotation: 1}, // 1 0 0 3
      {id: 28, i: 1, j: 1, rotation: 0}, // 1 0 1 0
    ];

    startState.players[0].hand = [{id: 46, rotation: 0}], // 1,3 1,3 1,3 1,3
    startState.players[0].supply = 21;
    startState.players[0].stones = [{i: 1, j: 1, corner: 0}];

    startState.players[1].hand = [{id: 1, rotation: 0}];
    startState.players[1].supply = 20;

    // board: 4 tiles
    // player1: 1 tile on hand, 21 tiles in supply
    // player2: 1 tile on hand, 20 tiles in supply
    // core: 1 tile

    // 0 0 | 0 3
    // 0 1 | 1 0
    // - -   -  -
    // 3 1 | (1) 0  + [1,3] [1,3]
    // 0 0 | 0   1 + [1,3] [1,3]

    // player 1 finishes the game by placing last tile and gains 1 supply tile
    const nextState = reducer(startState, actions.connectTile('id1', 46, 0, 1, 2));
    expect(nextState.isFinished).toBe(true);
    expect(nextState.players[0].supply).toBe(22);
    expect(nextState.players[0].score).toBe(4/*group*/ + 44/*supply*/ + 0/*hand*/);
    expect(nextState.players[1].score).toBe(0/*group*/ + 40/*supply*/ + 1/*hand*/);
  });

  it('does not calculate a score based on groups with more than one stone', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    startState.board = [
      {id: 2, i: 0, j: 0, rotation: 2}, // 1 0 0 0
      {id: 8, i: 0, j: 1, rotation: 3}, // 1 0 3 0
      {id: 14, i: 1, j: 0, rotation: 1}, // 1 0 0 3
      {id: 28, i: 1, j: 1, rotation: 0}, // 1 0 1 0
    ];

    startState.players[0].hand = [{id: 46, rotation: 0}];  // 1,3 1,3 1,3 1,3
    startState.players[0].stones = [{i: 0, j: 0, corner: 0}];
    startState.players[0].supply = 21;

    startState.players[1].hand = [{id: 1, rotation: 0}];
    startState.players[1].stones = [{i: 1, j: 1, corner: 0}];
    startState.players[1].supply = 20;

    // board: 4 tiles
    // player1: 1 tile on hand, 21 tiles in supply
    // player2: 1 tile on hand, 20 tiles in supply
    // core: 1 tile

    // 0  0  | 0   3
    // 0 (1) | 1   0
    // -  -    -   -
    // 0  1  | (1) 0
    // 3  0  | 0   1

    // player 1 finishes the game by placing last tile and gains 1 supply tile
    const nextState = reducer(startState, actions.connectTile('id1', 46, 0, 1, 2));
    expect(nextState.isFinished).toBe(true);
    expect(nextState.players[0].score).toBe(0/*group*/ + 44/*supply*/ + 0/*hand*/);
    expect(nextState.players[1].score).toBe(0/*group*/ + 40/*supply*/ + 1/*hand*/);
  });

  it('counts "big" tiles as 5 score points', () => {
    const startState = reducer(undefined, actions.start('game_id', ['id1', 'id2']));
    startState.board = [
      {id: 20, i: 0, j: 0, rotation: 2}, // 1 3 0 5
      {id: 22, i: 1, j: 0, rotation: 1}, // 1 1 0 4
      {id: 32, i: 2, j: 2, rotation: 0}, // 1 4 3 0
      {id: 34, i: 2, j: 0, rotation: 1}, // 1 0 2 3
      {id: 8, i: 0, j: 2, rotation: 3}, // 1 0 3 0
      {id: 14, i: 2, j: 1, rotation: 1}, // 1 0 0 3
      {id: 28, i: 1, j: 2, rotation: 0}, // 1 0 1 0
      {id: 1, i: 0, j: 1, rotation: 0}, // 2 2 1 1
    ];

    startState.players[0].hand = [{id: 42, rotation: 0}], // 1 1 1 1 [42]
    startState.players[0].stones = [{i: 0, j: 1, corner: 2}];
    startState.players[0].supply = 8;

    startState.players[1].hand = [];
    startState.players[1].supply = 30;
    startState.players[1].stones = [];

    // board: 8 tiles
    // player1: 1 tile on hand, 8 tiles in supply
    // player2: 0 tile on hand, 30 tiles in supply
    // core: 1 tile

    //      [20]  [1]   [8]
    //      5 0 | 0  0  | 0 3 | . .
    //      3 1 | 1 (1) | 1 0 | . .
    //      - -   +  +    - -
    // [22] 4 1 + 1  1  + 1 0 [28]
    //      0 1 + 1  1  + 0 1
    //      - -   +  +    - -
    //      3 1 | 3  1  | 1 4
    //      2 0 | 0  0  | 0 3
    //      [34]  [14]   [32]


    // player 1 finishes the game by placing last tile and gains 1 supply tile
    const nextState = reducer(startState, actions.connectTile('id1', 42, 0, 1, 1));
    expect(nextState.isFinished).toBe(true);
    expect(nextState.players[0].score).toBe(15/*group*/ + 18/*supply*/ + 0/*hand*/);
    expect(nextState.players[1].score).toBe(0/*group*/ + 60/*supply*/ + 0/*hand*/);
  });
});
