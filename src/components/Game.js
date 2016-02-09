import React, {Component} from 'react';
import Board from './Board';
import DragTile from './DragTile';
import {connect} from 'react-redux';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {possibleTiles, getPossibleConnections} from '../domain/board';
import {addTile} from '../actions/board';

export class Game extends Component {

  state = {
    possibleConnections: [],
  };

  render() {
    return <div>

      <Board
        tiles={this.props.board}
        placeholders={this.state.possibleConnections}
        onTileConnect={::this._connectTile}/>

      <div style={{overflow: 'auto'}}>

        {possibleTiles.map((tile, index) => {
          return <DragTile
            key={index}
            i={0} j={0}
            rotation={0}
            onDragStart={::this._setCurrentTile}
            {...tile} />;
        })}

      </div>
      <code>
        {JSON.stringify(this.props.board, null, 4)}
      </code>
    </div>;
  }

  _connectTile(props, i, j) {
    this.props.dispatch(addTile({
      id: props.id,
      i,
      j,
      corners: props.corners,
      rotation: props.rotation,
    }));
    console.log(JSON.stringify(props.corners), props.rotation, i, j);
  }

  _setCurrentTile(tile) {
    this.setState({
      possibleConnections: getPossibleConnections(this.props.board, tile),
    });
  }
}

export function mapToProps(state) {
  return state;
}

export default DragDropContext(HTML5Backend)(connect(mapToProps)(Game));
