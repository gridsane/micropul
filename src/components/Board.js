import React, {Component, PropTypes} from 'react';
import Radium from 'radium';
import Tile from './Tile';
import Placeholder from './Placeholder';

@Radium
export default class Board extends Component {

  static propTypes = {
    tiles: PropTypes.array.isRequired,
    placeholders: PropTypes.array.isRequired,
    onTileConnect: PropTypes.func.isRequired,
    tileSize: PropTypes.number,
  };

  static defaultProps = {
    tileSize: 64,
  };

  render() {
    const {tiles, placeholders, onTileConnect, tileSize} = this.props;

    return <div style={styles.container}>
      {tiles.map((tile, i) => {
        return <Tile key={`tile-${i}`} {...tile} size={tileSize} />;
      })}

      {placeholders.map((placeholder, i) => {
        return <Placeholder
          key={`placholder-${i}`}
          onDrop={onTileConnect}
          size={tileSize}
          {...placeholder} />;
      })}
    </div>;
  }
}

const styles = {
  container: {
    position: 'relative',
    height: 320,
    width: '100%',
    outline: '1px solid #666',
  },
};
