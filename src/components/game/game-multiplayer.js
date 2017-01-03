import React, {Component, PropTypes} from 'react';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {mergeState, connectTile, placeStone, refillHand} from '../../actions/game';
import {transformTiles} from '../../domain/board';
import styles from './game.scss';
import Game from './game';
import Chat from './game-chat';

@connect(mapToProps)
export default class GameMultiplayer extends Component {

  static propTypes = {
    socket: PropTypes.object,
  }

  static defaultProps = {
    socket: null,
    isStarted: false,
  }

  state = {
    messages: [],
    socket: null,
  }

  render() {

    const {messages} = this.state;
    const {isStarted, isFinished, core, tiles, boardStones, player, opponents} = this.props;

    if (!isStarted) {
      return <div>waiting for players...</div>;
    }

    return <div className={styles.multiplayer}>
      <div className={styles.multiplayerGame}>
        <Game
          core={core}
          tiles={tiles}
          hand={player.hand}
          supply={player.supply}
          stonesUsed={player.stones.length}
          boardStones={boardStones}
          onConnectTile={this._connectTile}
          onPlaceStone={this._placeStone}
          onRefillHand={this._refillHand}
          isFinished={isFinished}
          playerScore={player.score}
          opponentScore={opponents[0].score}
          onRestart={this._restart}
          onChangeGame={this._gotoSolo}
          className={styles.soloGame} />
      </div>
      <Chat
        playerId={player.id}
        messages={messages}
        onSend={this._sendMessage} />
    </div>;
  }

  componentWillMount() {
    const socket = io({forceNew: true});
    socket.on('game_update_state', this._updateState);
    socket.on('chat', this._addMessage);
    this.setState({socket});
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
    this.setState({socket: null});
  }

  _emitAction(action) {
    this.state.socket.emit('game_action', action);
  }

  _updateState = (gameState) => {
    this.props.dispatch(mergeState(gameState));
  }

  _connectTile = (tile, i, j) => {
    this._emitAction(connectTile(this.props.player.id, tile.id, tile.rotation, i, j));
  }

  _placeStone = (tileId, corner) => {
    this._emitAction(placeStone(this.props.player.id, tileId, corner));
  }

  _refillHand = () => {
     this._emitAction(refillHand(this.props.player.id, 1));
  }

  _sendMessage = (message) => {
    this.state.socket.emit('chat', message);
  }

  _addMessage = (data) => {
    this.setState({messages: [...this.state.messages, data]});
  }

  _restart = () => {
    console.warn('restart');
  }

  _gotoSolo = () => {
    console.warn('go to solo');
  }
}

export function mapToProps(state) {
  const isStarted = Boolean(state.game.startedAt);
  const player = state.game.players.find((p) => p.id === state.game.playerId);
  const opponents = player ? state.game.players.filter((p) => p.id !== player.id) : [];
  const core = 48 - state.game.board.length - (player
    ? player.hand.length + player.supply + opponents.reduce((acc, p) => (
        acc + p.supply + p.hand
      ), 0)
    : 0);

  return {
    isStarted,
    isFinished: state.game.isFinished,
    tiles: transformTiles(state.game.board),
    boardStones: state.game.players.reduce((acc, p) => (
      [...acc, ...p.stones.map((s) => ({...s, isOpponent: p.id !== player.id}))]
    ), []),
    player: player
      ? {...player, hand: transformTiles(player.hand)}
      : null,
    opponents,
    core,
  };
}
