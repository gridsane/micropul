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
    const {isStarted, tiles, boardStones, player} = this.props;

    if (!isStarted) {
      return <div>waiting for players...</div>;
    }

    return <div className={styles.multiplayerRoot}>
      <Game
        tiles={tiles}
        hand={player.hand}
        supply={player.supply}
        stonesUsed={player.stones.length}
        boardStones={boardStones}
        onConnectTile={this._connectTile}
        onPlaceStone={this._placeStone}
        onRefillHand={this._refillHand}
        className={styles.multiplayerGame} />
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
}

export function mapToProps(state) {
  const isStarted = Boolean(state.game.startedAt);
  const player = state.game.players.find((p) => p.id === state.game.playerId);

  return {
    isStarted,
    isFinished: state.game.isFinished,
    tiles: transformTiles(state.game.board),
    boardStones: state.game.players.reduce((acc, p) => (
      [...acc, ...p.stones.map((s) => ({...s, playerId: p.id}))]
    ), []),
    player: player
      ? {...player, hand: transformTiles(player.hand)}
      : null,
    opponents: player
      ? state.game.players.filter((p) => p.id !== player.id)
      : [],
  };
}
