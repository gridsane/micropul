import React, {Component, PropTypes} from 'react';
import styles from './game.scss';
import PlayerTile from './game-player-tile';

export default class Hand extends Component {
  static propTypes = {
    tiles: PropTypes.array.isRequired,
    supply: PropTypes.number.isRequired,
    onUpdatePlaceholders: PropTypes.func.isRequired,
    onClearPlaceholders: PropTypes.func.isRequired,
    onRefill: PropTypes.func.isRequired,
  }

  state = {
    rotations: {},
  }

  render() {
    const {tiles, supply, onUpdatePlaceholders, onClearPlaceholders, onRefill} = this.props;
    const {rotations} = this.state;

    return <div className={styles.gameHand}>
      <div className={styles.gameHandSupply} onClick={onRefill}>
        <div className={styles.gameHandSupplyLabel}>Supply</div>
        <div className={styles.gameHandSupplyTotal}>{supply}</div>
      </div>

      {tiles.map((tile) => {
        return <PlayerTile
          key={tile.id}
          {...tile}
          className={styles.gameHandTile}
          rotation={rotations[tile.id] || 0}
          onDragStart={onUpdatePlaceholders}
          onDragEnd={onClearPlaceholders}
          onRotate={this._rotateTile} />;
      })}
    </div>;
  }

  _rotateTile = (tileId, rotation) => {
    this.setState({
      rotations: {
        ...this.state.rotations,
        [tileId]: rotation,
      },
    });
  }
}
