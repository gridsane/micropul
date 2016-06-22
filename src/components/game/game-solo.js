import React, {Component} from 'react';
import {connect} from 'react-redux';
import {start, connectTile, placeStone, refillHand} from '../../actions/game';
import {transformTiles} from '../../domain/board';
import styles from './game.scss';
import Game from './game';
import Finish from './game-finish';

@connect(mapToProps)
export default class GameMultiplayer extends Component {

  render() {
    const {core, tiles, boardStones, player, isStarted, isFinished} = this.props;

    if (!isStarted) {
      return null;
    }
    return <div className={styles.solo}>
      {isFinished ? <Finish playerScore={player.score} /> : null}
      <Game
        core={core}
        tiles={tiles}
        hand={player.hand}
        stonesUsed={player.stones.length}
        boardStones={boardStones}
        supply={player.supply}
        onConnectTile={this._connectTile}
        onPlaceStone={this._placeStone}
        onRefillHand={this._refillHand}
        className={styles.soloGame} />
    </div>;
  }

  componentWillMount() {
    this.props.dispatch(start('solo_game', ['solo_player']));
  }

  _connectTile = (tile, i, j) => {
    this.props.dispatch(connectTile('solo_player', tile.id, tile.rotation, i, j));
  }

  _placeStone = (tileId, corner) => {
    this.props.dispatch(placeStone('solo_player', tileId, corner));
  }

  _refillHand = () => {
     this.props.dispatch(refillHand('solo_player', 1));
  }

}

export function mapToProps(state) {
  const isStarted = Boolean(state.game.startedAt);
  const player = state.game.players[0];

  return {
    isStarted,
    isFinished: state.game.isFinished,
    isFinished: state.game.isFinished,
    tiles: transformTiles(state.game.board),
    core: 48 - (player ? (player.hand.length + player.supply) : 0) - state.game.board.length,
    boardStones: player
      ? player.stones.map(s => ({...s, isOpponent: false}))
      : [],
    player: player ? {
      ...player,
      hand: transformTiles(player.hand),
    } : null,
  };
}
