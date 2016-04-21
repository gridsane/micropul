import React, {Component, PropTypes} from 'react';
import ClassNames from 'classnames';
import styles from './game.scss';

export default class Chat extends Component {
  static propTypes = {
    playerId: PropTypes.string.isRequired,
    messages: PropTypes.array.isRequired,
    onSend: PropTypes.func.isRequired,
  }

  state = {
    currentMessage: '',
  }

  render() {
    const {messages, playerId} = this.props;
    const {currentMessage} = this.state;

    return <aside className={styles.chat}>
      {messages.map((msg, i) => {
        const isOpponent = msg.playerId !== playerId;

        return <div key={i} className={styles.chatMessage}>
          <span className={ClassNames(styles.chatMessageAuthor, {
            [styles.chatMessageAuthorOpponent]: isOpponent,
          })}>
            {isOpponent ? 'opp' : 'you'}
          </span>
          <span className={styles.chatMessageText}>
            {msg.message}
          </span>
        </div>;
      })}
      <div className={styles.chatSend}>
        <input
          onKeyUp={this._keySendMessage}
          onChange={this._changeMessage}
          value={currentMessage}
          placeholder="Type your message!"
          type="text"
          className={styles.chatSendInput} />
        <button
          onClick={this._sendMessage}
          className={styles.chatSendButton}>Send</button>
      </div>
    </aside>;
  }

  _changeMessage = (event) => {
    this.setState({currentMessage: event.target.value});
  }

  _sendMessage = () => {
    if (this.state.currentMessage.length === 0) {
      return;
    }

    this.props.onSend(this.state.currentMessage);
    this.setState({currentMessage: ''});
  }

  _keySendMessage = (e) => {
    if (e.keyCode === 13) {
      this._sendMessage();
    }
  }
}
