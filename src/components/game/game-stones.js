import React, {Component, PropTypes} from 'react';
import styles from './game.scss';
import PlayerStone from './game-player-stone';

export default class Stones extends Component {

  static propTypes = {
    stonesUsed: PropTypes.number.isRequired,
    onUpdatePlaceholders: PropTypes.func.isRequired,
    onClearPlaceholders: PropTypes.func.isRequired,
  }

  render() {
    return <div className={styles.gameStones}>
      <div className={styles.gameStonesLabel}>Stones</div>
      {(new Array(3 - this.props.stonesUsed)).fill(1).map((_, i) => {
        return <PlayerStone
          key={i}
          className={styles.gameStonesStone}
          onDragStart={this.props.onUpdatePlaceholders}
          onDragEnd={this.props.onClearPlaceholders} />;
      })}
    </div>;
  }

}
