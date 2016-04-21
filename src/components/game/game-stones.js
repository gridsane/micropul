import React, {Component, PropTypes} from 'react';
import styles from './game.scss';
import Stone from '../stone/stone';

export default class Hand extends Component {

  static propTypes = {
    stones: PropTypes.number.isRequired,
  }

  render() {
    return <div className={styles.gameStones}>
      <div className={styles.gameStonesLabel}>Stones</div>
      {(new Array(3 - this.props.stones.length)).fill(1).map((_, i) => {
        return <Stone className={styles.gameStonesStone} key={i} />;
      })}
    </div>;
  }

}
