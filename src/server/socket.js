import crypto from 'crypto';
import * as gameActions from '../actions/game';
import gameReducer from '../reducers/game';
import {curried} from '../utils';

class SocketServer {
  constructor(io) {
    this.clients = [];
    this.games = [];
    this.io = io;

    io.on('connection', (socket) => {
      this.registerClient(socket);
    });
  }

  registerClient(socket) {
    let client = {
      socket,
      gameId: null,
      playerId: null,
    };
    socket.on('disconnect', curried(::this.disconnectClient, socket));

    const hostClient = this.clients.find((c) => !c.gameId);
    if (hostClient) {
      this.createGame(hostClient, client);
    }

    this.clients.push(client);
  }

  createGame(...clients) {
    const gameId = generateId();

    clients.forEach((c) => c.playerId = generateId());
    const playersIds = clients.map((c) => c.playerId);

    const gameState = gameReducer(undefined, gameActions.start(gameId, playersIds));
    this.games.push(gameState);

    clients.forEach((c) => {
      c.gameId = gameId;
      c.socket.join(gameId);
      c.socket.emit('game_start', {
        ...hideOpponentsHands(gameState, c.playerId),
        playerId: c.playerId,
      });

      this.listenClient(c, gameId);
    });
  }

  listenClient(client, gameId) {
    client.socket.on('chat', (message) => {
      this.io.to(gameId).emit('chat', {
        playerId: client.playerId,
        message,
      });
    });

    client.socket.on('game_action', (action) => {
      const gameIndex = this.games.findIndex((g) => g.gameId === gameId);
      const nextState = gameReducer(this.games[gameIndex], action);
      this.games[gameIndex] = nextState;

      this.clients.filter((c) => c.gameId === gameId).forEach((c) => {
        c.socket.emit('game_state', {
          ...hideOpponentsHands(nextState, c.playerId),
          playerId: c.playerId,
        });
      });
    });
  }

  disconnectClient(socket) {
    const index = this.clients.findIndex((c) => c.socket.id === socket.id);
    this.clients.splice(index, 1);
  }
}

function hideOpponentsHands(gameState, playerId) {
  return {
    ...gameState,
    players: gameState.players.map((p) => {
      if (p.id === playerId) {
        return p;
      }

      return {
        ...p,
        hand: p.hand.length,
      };
    }),
  };
}

function generateId() {
  return crypto.randomBytes(24).toString('hex');
}

export default (io) => {
  return new SocketServer(io);
}
