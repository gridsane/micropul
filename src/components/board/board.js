import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import styles from './board.scss';
import Tile from '../tile/tile';
import Stone from '../stone/stone';
import TilePlaceholder from './board-tile-placeholder';
import StonePlaceholder from './board-stone-placeholder';
import Positionable from './board-positionable';

export default class Board extends Component {

  static propTypes = {
    tiles: PropTypes.array.isRequired,
    stones: PropTypes.array.isRequired,
    possibleConnections: PropTypes.array.isRequired,
    possibleStonePlaces: PropTypes.array.isRequired,
    onConnectTile: PropTypes.func.isRequired,
    onPlaceStone: PropTypes.func.isRequired,
    tileSize: PropTypes.number,
    containerHeight: PropTypes.number,
  }

  static defaultProps = {
    tileSize: 64,
    containerHeight: 0,
  }

  render() {
    const {
      tiles,
      stones,
      possibleConnections,
      possibleStonePlaces,
      containerHeight,
    } = this.props;

    const bounds = getBounds(tiles);
    const boardSize = this._getBoardSize(bounds);
    const veticalMargin = {
      marginTop: Math.max(0, (containerHeight / 2) - (boardSize.height / 2)),
    };

    return <div className={styles.board} style={{...veticalMargin, ...boardSize}}>
      {tiles.map((tile, i) => {
        return <Positionable key={i} {...this._getPosition(bounds, tile.i, tile.j)}>
          <Tile
            id={tile.id}
            corners={tile.corners}
            rotation={tile.rotation} />
        </Positionable>;
      })}

      {stones.map((stone, i) => {
        return <Positionable
          key={i}
          {...this._getPosition(bounds, stone.i, stone.j, 2, .5)}>
          <Stone isOpponent={stone.isOpponent} />
        </Positionable>;
      })}

      {possibleConnections.map((placeholder, i) => {
        return <Positionable
          key={i}
          {...this._getPosition(bounds, placeholder.i, placeholder.j, 1)}>
          <TilePlaceholder onDrop={this.props.onConnectTile} {...placeholder} />
        </Positionable>;
      })}

      {possibleStonePlaces.map((placeholder, i) => {
        return <Positionable
          key={i}
          {...this._getPosition(bounds, placeholder.i, placeholder.j, 2, .5)}>
          <StonePlaceholder
            tileId={placeholder.tile.id}
            corner={placeholder.corner}
            onDrop={this.props.onPlaceStone} />
        </Positionable>;
      })}
    </div>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  _getPosition(bounds, i, j, zMod = 0, gridMod = 1) {
    const tileSize = this.props.tileSize;
    const positiveI = Math.abs(bounds.minI) / gridMod + i;
    const positiveJ = Math.abs(bounds.minJ) / gridMod + j;

    return {
      x: (positiveJ * (tileSize - 1)) * gridMod + tileSize,
      y: (positiveI * (tileSize - 1)) * gridMod + tileSize,
      z: positiveI + positiveJ + zMod + 2,
    };
  }

  _getBoardSize(bounds) {
    const {tileSize} = this.props;

    return {
      width: (Math.abs(bounds.minJ) + bounds.maxJ + 3) * tileSize,
      height: (Math.abs(bounds.minI) + bounds.maxI + 3) * tileSize,
    };
  }
}

function getBounds(tiles) {
  if (tiles.length === 0) {
    return {minI: 0, minJ: 0, maxI: 0, maxJ: 0};
  }

  return tiles.reduce((bounds, t) => {
    bounds.minI = Math.min(bounds.minI, t.i);
    bounds.minJ = Math.min(bounds.minJ, t.j);
    bounds.maxI = Math.max(bounds.maxI, t.i);
    bounds.maxJ = Math.max(bounds.maxJ, t.j);
    return bounds;
  }, {minI: Infinity, minJ: Infinity, maxI: -Infinity, maxJ: -Infinity});
}
