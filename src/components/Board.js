import React, {Component} from 'react';
import Tile from './Tile';

export default class Board extends Component {
  render() {
    return <svg viewBox="0 0 320 320" width={320} height={320}>
      {this.props.tiles.map((tile, i) => <Tile key={i} {...tile} />)}
    </svg>;
  }
}
