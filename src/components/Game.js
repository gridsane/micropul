import React, {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {connect} from 'react-redux';
import Board from './Board';
import DragTile from './DragTile';
import {getPossibleConnections, getCatalysts} from '../domain/board';
import {boardAddTile, applyCatalysts} from '../actions/game';

@DragDropContext(HTML5Backend)
export class Game extends Component {

  state = {
    possibleConnections: [],
  };

  render() {
    const {board, hand, supply} = this.props;

    return <div>
      <Board
        tileSize={48}
        tiles={board}
        placeholders={this.state.possibleConnections}
        onTileConnect={::this._connectTile}/>

      <div style={{overflow: 'auto'}}>

        {hand.map((tile, index) => {
          return <DragTile
            key={index}
            i={0} j={0}
            rotation={0}
            onDragStart={::this._setCurrentTile}
            {...tile} />;
        })}

      </div>
      <ul>
        <li><strong>Supply:</strong> {supply}</li>
      </ul>
      <code>
        {JSON.stringify(this.props.board, null, 4)}
      </code>
    </div>;
  }

  _connectTile(tile, i, j) {
    const {dispatch, board} = this.props;
    const {id, corners, rotation} = tile;

    dispatch(boardAddTile({
      i, j,
      id,
      corners,
      rotation,
    }));

    dispatch(applyCatalysts(getCatalysts(board, tile, i, j)));
  }

  _setCurrentTile(tile) {
    this.setState({
      possibleConnections: getPossibleConnections(this.props.board, tile),
    });
  }
}

export function mapToProps(state) {
  return state.game;
}

export default connect(mapToProps)(Game);
