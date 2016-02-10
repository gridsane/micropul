import React, {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {connect} from 'react-redux';
import Board from './Board';
import DragTile from './DragTile';
import {possibleTiles, getPossibleConnections} from '../domain/board';
import {addTile} from '../actions/board';

@DragDropContext(HTML5Backend)
export class Game extends Component {

  state = {
    possibleConnections: [],
  };

  render() {
    return <div>
      <Board
        tileSize={48}
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
      i, j,
      id: props.id,
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

export default connect(mapToProps)(Game);
