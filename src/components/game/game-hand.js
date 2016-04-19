import React, {Component, PropTypes} from 'react';
import styles from './game.scss';
import HandTile from './game-hand-tile';

export default class Hand extends Component {
  static propTypes = {
    tiles: PropTypes.array.isRequired,
    supply: PropTypes.number.isRequired,
    onUpdatePlaceholders: PropTypes.func.isRequired,
    onClearPlaceholders: PropTypes.func.isRequired,
    onRefill: PropTypes.func.isRequired,
  };

  state = {
    rotations: {},
  };

  render() {
    const {tiles, supply, onUpdatePlaceholders, onClearPlaceholders, onRefill} = this.props;
    const {rotations} = this.state;

    return <div className={styles.gameHand}>
      <div className={styles.gameHandSupply} onClick={onRefill}>
        <div className={styles.gameHandSupplyLabel}>Supply</div>
        <div className={styles.gameHandSupplyTotal}>{supply}</div>
      </div>

      {tiles.map((tile) => {
        return <HandTile
          key={tile.id}
          {...tile}
          rotation={rotations[tile.id] || 0}
          onDragStart={onUpdatePlaceholders}
          onDragEnd={onClearPlaceholders}
          onRotate={::this._rotateTile} />;
      })}
    </div>;
  }

  _rotateTile(tileId, rotation) {
    console.log(tileId, rotation);
    this.setState({
      rotations: {
        ...this.state.rotations,
        [tileId]: rotation,
      },
    });
  }
}
