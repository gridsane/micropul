import React, {Component, PropTypes} from 'react';
import styles from './game.scss';
import {Link} from 'react-router';

export default class Finish extends Component {
  static propTypes = {
    playerScore: PropTypes.number.isRequired,
    opponentScore: PropTypes.number,
  }

  static defaultProps = {
    opponentScore: null,
  }

  render() {
    const {playerScore, opponentScore} = this.props;

    return <div className={styles.gameFinish}>
      <h1>Game over</h1>
      <div className={styles.gameFinishScoreLabel}>Score</div>
      <div className={styles.gameFinishScore}>
        <div className={styles.gameFinishScoreYour}>{playerScore}</div>
        {opponentScore !== null
          ? <div className={styles.gameFinishScoreOpponent}>{opponentScore}</div>
          : null}
      </div>
      {this._renderEndline()}
      <p>
        <Link to="/multi">Play multiplayer</Link> or <Link to="/solo">Go solo</Link>
      </p>
    </div>;
  }

  _renderEndline() {
    const {playerScore, opponentScore} = this.props;

    if (opponentScore === null) {
      return null;
    }

    let endLine, headerClass;
    if (playerScore > opponentScore) {
      endLine = 'You win!';
      headerClass = styles.gameFinishWin;
    } else if (playerScore < opponentScore) {
      endLine = 'You lose.';
      headerClass = styles.gameFinishLose;
    } else {
      endLine = 'It\'s a draw!';
      headerClass = styles.gameFinishDraw;
    }

    return <h2 className={headerClass}>{endLine}</h2>;
  }
}
