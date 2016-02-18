import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as game from '../actions/game';
import SoloGame from './SoloGame';

export class Game extends Component {

  static propTypes = {
    gameState: PropTypes.object.isRequired,
    player: PropTypes.string.isRequired,
    opponents: PropTypes.array.isRequired,
    isPlayerTurn: PropTypes.bool.isRequired,
    board: PropTypes.array.isRequired,
    isFinished: PropTypes.bool.isRequired,
    isSolo: PropTypes.bool,
  };

  static defaultProps = {
    isSolo: true,
  };

  componentWillMount() {
  }

  render() {
    const {player, opponents, isPlayerTurn, board, isFinished} = this.props;

    return <SoloGame {...{player, opponents, isPlayerTurn, board, isFinished}}
      onTileConnect={::this._connectTile}
      onPlaceStone={::this._placeStone}
      onSkipTurn={::this._skipTurn}
      onRefillHand={::this._refillHand}
    />;
  }

  _connectTile(tileId, rotation, i, j) {
    this.props.dispatch(game.connectTile(
      this.props.gameState.playerId,
      tileId,
      rotation,
      i,
      j
    ));
  }

  _placeStone(i, j) {
    this.props.dispatch(game.placeStone(this.props.gameState.playerId, i, j));
  }

  _skipTurn() {
    this.props.dispatch(game.skipTurn(this.props.gameState.playerId));
  }

  _refillHand() {
    this.props.dispatch(game.refillHand(this.props.gameState.playerId));
  }

}

export function mapToProps(state) {
  const gameState = state.game;

  return {
    player: gameState.players.find((p) => p.id = gameState.playerId),
    opponents: gameState.players.filter((p) => p.id !== gameState.playerId),
    isPlayerTurn: gameState.currentTurn === gameState.playerId,
    board: gameState.board,
    isFinished: gameState.isFinished,
  };
}

export default connect(mapToProps)(Game);
