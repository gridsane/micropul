import React, {Component, PropTypes} from 'react';
import Button from '../ui/button';
import styles from './finish.scss';

export default class Finish extends Component {
  static propTypes = {
    playerScore: PropTypes.number.isRequired,
    opponentScore: PropTypes.number,
  }

  static defaultProps = {
    opponentScore: null,
  }

  render() {
    const {playerScore, opponentScore, onRestart, onChangeGame} = this.props;

    return <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.title}>{this._renderEndline()}</div>
        <div className={styles.score}>
          <div>Your score: <span className={styles.scorePlayer}>{playerScore}</span></div>
          {opponentScore
            ? <div>Opponent score: <span className={styles.scoreOpponent}>{opponentScore}</span></div>
            : null}
        </div>
        <div>
          <Button
            onClick={onRestart}
            label="Restart"
            className={styles.action}
            contrast/>
          <Button
            onClick={onChangeGame}
            label={opponentScore
              ? 'Play solo'
              : 'Play with people'}
            className={styles.action}/>
        </div>
      </div>
    </div>;
  }

  _renderEndline() {
    const {playerScore, opponentScore} = this.props;

    if (opponentScore === null) {
      return 'Game over';
    } else if (playerScore > opponentScore) {
      return 'You win!';
    } else if (playerScore < opponentScore) {
      return 'You lose.';
    }

    return 'It\'s a draw!';
  }
}
