import initSocket from '../../src/server/socket';
import {skipTurn} from '../../src/actions/game';

describe('Multiplayer socket', () => {

  let server;
  const ioMock = createIoMock();

  beforeEach(() => {
    server = initSocket(ioMock);
  });

  afterEach(() => {
    ioMock.clear();
  });

  it('registers clients', () => {
    const socket = createSocketMock('hello');

    ioMock.emit('connection', socket);

    expect(server.clients).toEqual([
      {socket, gameId: null, playerId: null},
    ]);
  });

  it('disconnects clients', () => {
    const socket = createSocketMock('hello');

    ioMock.emit('connection', socket);
    socket.emit('disconnect');

    expect(server.clients.length).toBe(0);
  });

  it('pairs clients', () => {
    const socket1 = createSocketMock('id1');
    const socket2 = createSocketMock('id2');

    ioMock.emit('connection', socket1);
    ioMock.emit('connection', socket2);

    expect(server.games.length).toBe(1);
    const gameId = server.games[0].gameId;
    expect(server.clients[0].gameId).toBe(gameId);
    expect(server.clients[1].gameId).toBe(gameId);
    expect(server.clients[0].playerId).toNotBe(server.clients[1].playerId);
    expect(socket1.getRooms()).toEqual([gameId]);
    expect(socket2.getRooms()).toEqual([gameId]);
  });

  it('starts game', () => {
    const socket1 = createSocketMock('id1');
    const socket2 = createSocketMock('id2');

    socket1.on('game_start', (gameState) => {
      expect(gameState.players[1].hand).toBe(6);
      expect(gameState.playerId).toBe(gameState.players[0].id);
    });

    socket2.on('game_start', (gameState) => {
      expect(gameState.players[0].hand).toBe(6);
      expect(gameState.playerId).toBe(gameState.players[1].id);
    });

    ioMock.emit('connection', socket1);
    ioMock.emit('connection', socket2);

    expect(server.games[0].players.length).toBe(2);
    expect(server.games[0].players[0].id).toBe(server.clients[0].playerId);
    expect(server.games[0].players[1].id).toBe(server.clients[1].playerId);
  });

  it('broadcasts in-game chat messages', () => {
    const socket1 = createSocketMock('id1');
    const socket2 = createSocketMock('id2');
    ioMock.emit('connection', socket1);
    ioMock.emit('connection', socket2);

    const emitSpy = expect.createSpy();
    const toSpy = expect.spyOn(ioMock, 'to').andReturn({emit: emitSpy});

    socket1.emit('chat', 'hello there');

    const gameId = server.games[0].gameId;
    expect(toSpy).toHaveBeenCalledWith(gameId);
    expect(emitSpy).toHaveBeenCalledWith('chat', {
      playerId: server.clients[0].playerId,
      message: 'hello there',
    });
  });

  it('reacts on game actions with new game state', () => {
    const socket1 = createSocketMock('id1');
    const socket2 = createSocketMock('id2');
    ioMock.emit('connection', socket1);
    ioMock.emit('connection', socket2);

    const gameState = server.games[0];

    socket1.on('game_state', function (nextState) {
      expect(nextState.players[1].hand).toBe(6);
      expect(nextState.playerId).toEqual(gameState.players[0].id);
      expect(nextState.turnQueue).toEqual([nextState.players[1].id]);
    });

    socket2.on('game_state', function (nextState) {
      expect(nextState.players[0].hand).toBe(6);
      expect(nextState.playerId).toEqual(gameState.players[1].id);
      expect(nextState.turnQueue).toEqual([nextState.players[1].id]);
    });

    socket1.emit('game_action', skipTurn(gameState.players[0].id));
  });

});

function createEventEmitter() {
  let subscribers = {};

  return {
    on(event, callback) {
      if (!subscribers[event]) {
        subscribers[event] = [];
      }

      subscribers[event].push(callback);
    },

    emit(event, data) {
      if (subscribers[event]) {
        subscribers[event].forEach((cb) => cb(data));
      }
    },

    to() {
      return {emit: () => null};
    },

    clear() {
      subscribers = {};
    },
  };
}

function createSocketMock(id) {
  let rooms = [];

  return {
    id,
    join(room) {
      rooms.push(room);
    },
    leave(room) {
      let i = rooms.indexOf(room);
      if (i !== -1) {
        rooms.splice(i, 1);
      }
    },
    getRooms() {
      return rooms;
    },
    ...createEventEmitter(),
  };
}

function createIoMock() {
  return createEventEmitter();
}
