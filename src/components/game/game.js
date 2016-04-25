import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {
  getPossibleConnections,
  getPossibleStonePlaces,
  getStonesCoords,
} from '../../domain/board';
import ClassNames from 'classnames';
import styles from './game.scss';
import Board from '../board/board-pannable';
import Player from './game-player';

const TILE_SIZE = 64;

export class Game extends Component {

  static propTypes = {
    core: PropTypes.number.isRequired,
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
    const {core, tiles, hand, supply, stonesUsed, boardStones, className} = this.props;
    const {possibleConnections, possibleStonePlaces} = this.state;

    return <div className={ClassNames(styles.game, className)}>
      <Board
        tileSize={TILE_SIZE}
        tiles={tiles}
        stones={getStonesCoords(tiles, boardStones)}
        possibleConnections={possibleConnections}
        possibleStonePlaces={possibleStonePlaces}
        onConnectTile={this.props.onConnectTile}
        onPlaceStone={this.props.onPlaceStone} />

      <Player
          core={core}
          tiles={hand}
          supply={supply}
          stonesUsed={stonesUsed}
          onUpdateTilePlaceholders={this._updateTilePlaceholders}
          onClearTilePlaceholders={this._clearTilePlaceholders}
          onUpdateStonePlaceholders={this._updateStonePlaceholders}
          onClearStonePlaceholders={this._clearStonePlaceholders}
          onRefill={this.props.onRefillHand} />
    </div>;
  }

  _updateTilePlaceholders = (tile) => {
    this.setState({possibleConnections: getPossibleConnections(this.props.tiles, tile)});
  }

  _clearTilePlaceholders = () => {
    this.setState({possibleConnections: []});
  }

  _updateStonePlaceholders = () => {
    this.setState({possibleStonePlaces: getPossibleStonePlaces(this.props.tiles, this.props.boardStones)});
  };

  _clearStonePlaceholders = () => {
    this.setState({possibleStonePlaces: []});
  }
}

export default DragDropContext(HTML5Backend)(Game);
