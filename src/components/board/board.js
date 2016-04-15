import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import styles from './board.scss';
import Tile from '../tile/tile';
import Placeholder from './board-tile-placeholder';
import Positionable from './board-positionable';

export default class Board extends Component {

  static propTypes = {
    tiles: PropTypes.array.isRequired,
    placeholders: PropTypes.array.isRequired,
    onConnectTile: PropTypes.func.isRequired,
    onCornerClick: PropTypes.func.isRequired,
    tileSize: PropTypes.number,
  };

  static defaultProps = {
    tileSize: 64,
  };

  render() {
    const {tiles, placeholders, onConnectTile} = this.props;
    const bounds = getBounds(tiles);

    return <div className={styles.board} style={this._getBoardSize(bounds)}>
      {tiles.map((tile, i) => {
        return <Positionable key={`tile-${i}`} {...this._getPosition(bounds, tile.i, tile.j)}>
          <Tile
            id={tile.id}
            corners={tile.corners}
            rotation={tile.rotation}
            onCornerClick={::this.props.onCornerClick} />
        </Positionable>;
      })}

      {placeholders.map((placeholder, i) => {
        return <Positionable key={`placholder-${i}`} {...this._getPosition(bounds, placeholder.i, placeholder.j)}>
          <Placeholder onDrop={onConnectTile} {...placeholder} />
        </Positionable>;
      })}
    </div>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  _getPosition(bounds, i, j) {
    return {
      x: (j + Math.abs(bounds.minJ) + 1) * this.props.tileSize,
      y: (i + Math.abs(bounds.minI) + 1) * this.props.tileSize,
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
