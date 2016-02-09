import React, {Component} from 'react';
import Radium from 'radium';
import Tile from './Tile';
import Placeholder from './Placeholder';

class Board extends Component {
  render() {
    return <div style={styles.container}>

      {this.props.tiles.map((tile, i) => {
        return <Tile key={`tile-${i}`} {...tile} />;
      })}

      {this.props.placeholders.map((placeholder, i) => {
        return <Placeholder
          key={`placholder-${i}`}
          onDrop={::this._connectTile}
          {...placeholder} />;
      })}

    </div>;
  }

  _connectTile(...args) {
    this.props.onTileConnect(...args);
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

export default Radium(Board);
