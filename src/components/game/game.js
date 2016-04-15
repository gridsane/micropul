import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ElementPan from 'react-element-pan';
import {curried} from '../../utils';
import {getPossibleConnections} from '../../domain/board';
import styles from './game.scss';
import Board from '../board/board';
import HandTile from './game-hand-tile';

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
    boardPan: {x: 0, y: 0},
    handRotations: {},
  };

  render() {
    const {tiles, hand, supply, stones, className} = this.props;
    const {boardPan, placeholders} = this.state;

    return <div className={className}>
      <ElementPan
        width={640}
        height={240}
        startX={boardPan.x}
        startY={boardPan.y}
        onPanStop={::this._boardPanStop}
        className={styles.gameBoardPan}>
        <Board
          tileSize={TILE_SIZE}
          tiles={tiles}
          placeholders={placeholders}
          onConnectTile={::this.props.onConnectTile}
          onCornerClick={::this.props.onPlaceStone} />
      </ElementPan>

      <div className={styles.gameHand}>
        {hand.map((tile, index) => this._renderHandTile(styles, tile, index))}
      </div>

      <button onClick={::this.props.onRefillHand}>Refill hand ({supply})</button>
      <br/><strong>Stones left:</strong> {3 - stones.length}
    </div>;
  }

  _renderHandTile(styles, tile, index) {
    const rotation = this.state.handRotations[tile.id] || 0;
    return <div className={styles.gameHandTile} key={index}>
      <HandTile {...tile}
        onDragStart={::this._updatePlaceholders}
        onDragEnd={::this._clearPlaceholders}
        x={0}
        y={0}
        rotation={rotation} />
      <button onClick={curried(::this._rotateHandTile, tile.id, rotation + 1)}>
        rotate
      </button>
    </div>;
  }

  _updatePlaceholders(tile) {
    this.setState({placeholders: getPossibleConnections(this.props.tiles, tile)});
  }

  _clearPlaceholders() {
    this.setState({placeholders: []});
  }

  _boardPanStop(position) {
    this.setState({boardPan: position});
  }

  _rotateHandTile(tileId, rotation) {
    this.setState({handRotations: {...this.state.handRotations, [tileId]: rotation}});
  }
}

export default DragDropContext(HTML5Backend)(Game);
