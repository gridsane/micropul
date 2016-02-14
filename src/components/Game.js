import React, {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {connect} from 'react-redux';
import Board from './Board';
import DragTile from './DragTile';
import {getPossibleConnections, getCatalysts, getGroup} from '../domain/board';
import {boardAddTile, applyCatalysts, handAddTile} from '../actions/game';

@DragDropContext(HTML5Backend)
export class Game extends Component {

  state = {
    possibleConnections: [],
    group: [],
  };

  render() {
    const {board, hand, supply} = this.props;

    return <div>
      <Board
        tileSize={48}
        tiles={board}
        group={this.state.group}
        placeholders={this.state.possibleConnections}
        onTileConnect={::this._connectTile}
        onCornerClick={::this._cornerClick}/>

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
        <li>
          <strong>Supply:</strong> {supply}
          <button onClick={::this._supplyToHand}>to hand</button>
        </li>
      </ul>
      <code>
        {JSON.stringify(this.props.board, null, 4)}
      </code>
    </div>;
  }

  _supplyToHand() {
    this.props.dispatch(handAddTile(1));
  }

  _cornerClick(tile, cornerIndex) {
    const group = getGroup(this.props.board, tile.i, tile.j, cornerIndex);
    console.log(group);
    this.setState({group});
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
