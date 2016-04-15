import React, {Component, PropTypes} from 'react';

export default class Chat extends Component {
  static propTypes = {
    playerId: PropTypes.string.isRequired,
    messages: PropTypes.array.isRequired,
    onSend: PropTypes.func.isRequired,
  };

  state = {
    currentMessage: '',
  };

  render() {
    const {messages, playerId} = this.props;
    const {currentMessage} = this.state;

    return <aside style={styles.container}>
      {messages.map((msg, i) => {
        return <div key={i}>
          <strong>{msg.playerId === playerId ? 'you' : 'opp'}</strong>:
          {msg.message}
        </div>;
      })}
      <div style={styles.sendContainer}>
        <input
          onChange={::this._changeMessage}
          value={currentMessage}
          type="text"
          style={styles.sendInput} />
        <button
          onClick={::this._sendMessage}
          style={styles.sendButton}>Send</button>
      </div>
    </aside>;
  }

  _changeMessage(event) {
    this.setState({currentMessage: event.target.value});
  }

  _sendMessage() {
    this.props.onSend(this.state.currentMessage);
    this.setState({currentMessage: null});
  }
}

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingBottom: 24,
    width: 200,
    maxWidth: 200,
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  sendContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  sendInput: {
    flexGrow: 5,
  },
  sendButton: {
    flexGrow: 1,
  },
};
