import React, {Component} from 'react';
import {connect} from 'react-redux';

export class Application extends Component {
  render() {
    return <div>
      <code>
        {JSON.stringify(this.props.board, null, 4)}
      </code>
    </div>;
  }
}

export function mapToProps(state) {
  return state;
}

export default connect(mapToProps)(Application);
