import React, {Component, PropTypes} from 'react';
import styles from './game.scss';
import ClassNames from 'classnames';
import PlayerTile from './game-player-tile';
import PlayerStone from './game-player-stone';

export default class Player extends Component {
  static propTypes = {
    tiles: PropTypes.array.isRequired,
    supply: PropTypes.number.isRequired,
    core: PropTypes.number.isRequired,
    stonesUsed: PropTypes.number.isRequired,
    onUpdateTilePlaceholders: PropTypes.func.isRequired,
    onClearTilePlaceholders: PropTypes.func.isRequired,
    onUpdateStonePlaceholders: PropTypes.func.isRequired,
    onClearStonePlaceholders: PropTypes.func.isRequired,
    onRefill: PropTypes.func.isRequired,
  }

  state = {
    rotations: {},
  }

  render() {
    const {rotations} = this.state;

    return <div className={styles.gamePlayer}>
      <div className={styles.gamePlayerItem}>
        <div className={styles.gamePlayerItemLabel}>Core</div>
        <div className={styles.gamePlayerItemValue}>{this.props.core}</div>
      </div>

      <div className={styles.gamePlayerItem}>
        <div className={styles.gamePlayerItemLabel}>Stones</div>
        {(new Array(3 - this.props.stonesUsed)).fill(1).map((_, i) => {
          return <PlayerStone
            key={i}
            className={styles.gamePlayerStone}
            onDragStart={this.props.onUpdateStonePlaceholders}
            onDragEnd={this.props.onClearStonePlaceholders} />;
        })}
      </div>

      <div
        className={ClassNames(styles.gamePlayerItem, styles.gamePlayerSupply)}
        onClick={this.props.onRefill}>
        <div className={styles.gamePlayerItemLabel}>Supply</div>
        <div className={styles.gamePlayerItemValue}>{this.props.supply}</div>
      </div>

      {this.props.tiles.map((tile) => {
        return <PlayerTile
          key={tile.id}
          {...tile}
          className={ClassNames(styles.gamePlayerItem, styles.gamePlayerTile)}
          rotation={rotations[tile.id] || 0}
          onDragStart={this.props.onUpdateTilePlaceholders}
          onDragEnd={this.props.onClearTilePlaceholders}
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
