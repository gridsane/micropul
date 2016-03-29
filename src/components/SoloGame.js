import React, {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ElementPan from 'react-element-pan';
import {connect} from 'react-redux';
import {curried} from '../utils';
import {
  start,
  connectTile,
  refillHand,
  placeStone,
} from '../actions/game';
import {
  transformTiles,
  getPossibleConnections,
} from '../domain/board';
import Board from './Board';
import DragTile from './DragTile';

@DragDropContext(HTML5Backend)
@connect(mapToProps)
export default class SoloGame extends Component {

  state = {
    placeholders: [],
    boardPan: {x: 0, y: 0},
    handRotations: {},
    tileSize: 64,
  };

  render() {
    const {tiles, hand, supply, stones} = this.props;
    const {tileSize, boardPan, placeholders} = this.state;
    const styles = this.getStyles();

    return <div>
      <div style={styles.boardContainer}>
        <ElementPan
          width={640}
          height={240}
          startX={boardPan.x}
          startY={boardPan.y}
          onPanStop={::this._boardPanStop}>
          <Board
            tileSize={tileSize}
            tiles={tiles}
            placeholders={placeholders}
            onTileConnect={::this._connectTile}
            onCornerClick={::this._placeStone} />
        </ElementPan>
      </div>

      <div style={styles.hand}>
        {hand.map((tile, index) => this._renderHandTile(styles, tile, index))}
      </div>

      <button onClick={::this._refillHand}>Refill hand ({supply})</button>
      <br/><strong>Stones left:</strong> {3 - stones.length}

      <pre><code>{JSON.stringify(this.state, null, 2)}</code></pre>
      <pre><code>{JSON.stringify(this.props, null, 2)}</code></pre>
    </div>;
  }

  componentWillMount() {
    this.props.dispatch(start(['solo_player']));
  }

  _renderHandTile(styles, tile, index) {
    const rotation = this.state.handRotations[tile.id] || 0;
    return <div style={styles.handTile} key={index}>
      <DragTile {...tile}
        onDragStart={::this._updatePlaceholders}
        x={0}
        y={0}
        rotation={rotation} />
      <button onClick={curried(::this._rotateHandTile, tile.id, rotation + 1)}>
        rotate
      </button>
    </div>;
  }

  _connectTile(tile, i, j) {
    this.props.dispatch(connectTile('solo_player', tile.id, tile.rotation, i, j));
  }

  _placeStone(tile, corner) {
    this.props.dispatch(placeStone('solo_player', tile.i, tile.j, corner));
  }

  _updatePlaceholders(tile) {
    this.setState({placeholders: getPossibleConnections(this.props.tiles, tile)});
  }

  _boardPanStop(position) {
    this.setState({boardPan: position});
  }

  _refillHand() {
    this.props.dispatch(refillHand('solo_player', 1));
  }

  _rotateHandTile(tileId, rotation) {
    this.setState({handRotations: {...this.state.handRotations, [tileId]: rotation}});
  }

  getStyles() {
    const {tileSize} = this.state;

    return {
      boardContainer: {
        border: '1px solid red',
      },
      hand: {
        height: tileSize,
        marginBottom: 30,
      },
      handTile: {
        width: tileSize,
        height: tileSize,
        float: 'left',
      },
    };
  }
}

export function mapToProps(state) {
  const player = state.game.players[0];
  const playerProps = player ? {
    hand: transformTiles(state.game.players[0].hand),
    supply: player.supply,
    stones: player.stones,
  } : {
    hand: [],
    supply: 0,
    stones: [],
  };

  return {
    tiles: transformTiles(state.game.board),
    ...playerProps,
  };
}
