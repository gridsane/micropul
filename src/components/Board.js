import React, {Component, PropTypes} from 'react';
import Tile from './Tile';
import Placeholder from './Placeholder';

export default class Board extends Component {

  static propTypes = {
    tiles: PropTypes.array.isRequired,
    placeholders: PropTypes.array.isRequired,
    onTileConnect: PropTypes.func.isRequired,
    onCornerClick: PropTypes.func.isRequired,
    group: PropTypes.array,
    tileSize: PropTypes.number,
  };

  static defaultProps = {
    tileSize: 64,
    group: [],
  };

  render() {
    const {tiles, placeholders, onTileConnect, tileSize, group} = this.props;
    const bounds = getBounds(tiles);
    const styles = this.getStyles(bounds);

    return <div style={styles.container}>
      {tiles.map((tile, i) => {
        const {x, y} = this._getPosition(bounds, tile.i, tile.j);
        return <Tile
          x={x}
          y={y}
          key={`tile-${i}`}
          {...tile}
          highlightedCorners={group.filter((g) => {
            return g.i === tile.i && g.j === tile.j;
          })}
          onCornerClick={::this.props.onCornerClick}
          size={tileSize} />;
      })}

      {placeholders.map((placeholder, i) => {
        const {x, y} = this._getPosition(bounds, placeholder.i, placeholder.j);
        return <Placeholder
          x={x}
          y={y}
          key={`placholder-${i}`}
          onDrop={onTileConnect}
          size={tileSize}
          {...placeholder} />;
      })}
    </div>;
  }

  _getPosition(bounds, i, j) {
    return {
      x: (j + Math.abs(bounds.minJ) + 1) * this.props.tileSize,
      y: (i + Math.abs(bounds.minI) + 1) * this.props.tileSize,
    };
  }

  getStyles(bounds) {
    const {tileSize} = this.props;

    return {
      container: {
        position: 'relative',
        margin: '0 auto',
        width: (Math.abs(bounds.minJ) + bounds.maxJ + 3) * tileSize,
        height: (Math.abs(bounds.minI) + bounds.maxI + 3) * tileSize,
        outline: '1px solid yellow',
      },
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
