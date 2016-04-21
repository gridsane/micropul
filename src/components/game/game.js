import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {getPossibleConnections, getPossibleStonePlaces} from '../../domain/board';
import ClassNames from 'classnames';
import styles from './game.scss';
import Board from '../board/board-pannable';
import Hand from './game-hand';
import Stones from './game-stones';

const TILE_SIZE = 64;

export class Game extends Component {

  static propTypes = {
    tiles: PropTypes.array.isRequired,
    hand: PropTypes.array.isRequired,
    stonesUsed: PropTypes.number.isRequired,
    boardStones: PropTypes.array.isRequired,
    supply: PropTypes.number.isRequired,
    onConnectTile: PropTypes.func.isRequired,
    onPlaceStone: PropTypes.func.isRequired,
    onRefillHand: PropTypes.func.isRequired,
  }

  state = {
    possibleConnections: [],
    possibleStonePlaces: [],
    handRotations: {},
  }

  render() {
    const {tiles, hand, supply, stonesUsed, className} = this.props;
    const {possibleConnections, possibleStonePlaces} = this.state;

    return <div className={ClassNames(styles.gameRoot, className)}>
      <Board
        tileSize={TILE_SIZE}
        tiles={tiles}
        possibleConnections={possibleConnections}
        possibleStonePlaces={possibleStonePlaces}
        onConnectTile={this.props.onConnectTile}
        onPlaceStone={this.props.onPlaceStone} />

      <div className={styles.gamePlayer}>
        <Stones
          stonesUsed={stonesUsed}
          onUpdatePlaceholders={this._updatePossibleStonePlaces}
          onClearPlaceholders={this._clearPossibleStonePlaces} />
        <Hand
          tiles={hand}
          supply={supply}
          onUpdatePlaceholders={this._updatePossibleConnections}
          onClearPlaceholders={this._clearPossibleConnections}
          onRefill={this.props.onRefillHand}/>
      </div>
    </div>;
  }

  _updatePossibleConnections = (tile) => {
    this.setState({possibleConnections: getPossibleConnections(this.props.tiles, tile)});
  }

  _clearPossibleConnections = () => {
    this.setState({possibleConnections: []});
  }

  _updatePossibleStonePlaces = () => {
    this.setState({possibleStonePlaces: getPossibleStonePlaces(this.props.tiles, this.props.boardStones)});
  };

  _clearPossibleStonePlaces = () => {
    this.setState({possibleStonePlaces: []});
  }
}

export default DragDropContext(HTML5Backend)(Game);
