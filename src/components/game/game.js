import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {getPossibleConnections} from '../../domain/board';
import ClassNames from 'classnames';
import styles from './game.scss';
import Board from '../board/board-pannable';
import Hand from './game-hand';

const TILE_SIZE = 64;

export class Game extends Component {

  static propTypes = {
    tiles: PropTypes.array.isRequired,
    hand: PropTypes.array.isRequired,
    stones: PropTypes.array.isRequired,
    supply: PropTypes.number.isRequired,
    onConnectTile: PropTypes.func.isRequired,
    onPlaceStone: PropTypes.func.isRequired,
    onRefillHand: PropTypes.func.isRequired,
  };

  state = {
    placeholders: [],
    handRotations: {},
  };

  render() {
    const {tiles, hand, supply, stones, className} = this.props;
    const {placeholders} = this.state;

    return <div className={ClassNames(styles.gameRoot, className)}>
      <Board
        tileSize={TILE_SIZE}
        tiles={tiles}
        placeholders={placeholders}
        onConnectTile={::this.props.onConnectTile}
        onCornerClick={::this.props.onPlaceStone} />

      <Hand
        tiles={hand}
        supply={supply}
        onUpdatePlaceholders={::this._updatePlaceholders}
        onClearPlaceholders={::this._clearPlaceholders}
        onRefill={::this.props.onRefillHand}/>

      <div className={styles.gameStones}>
        <strong>Stones left:</strong> {3 - stones.length}
      </div>
    </div>;
  }

  _updatePlaceholders(tile) {
    this.setState({placeholders: getPossibleConnections(this.props.tiles, tile)});
  }

  _clearPlaceholders() {
    this.setState({placeholders: []});
  }

  _rotateHandTile(tileId, rotation) {
    this.setState({handRotations: {...this.state.handRotations, [tileId]: rotation}});
  }
}

export default DragDropContext(HTML5Backend)(Game);
