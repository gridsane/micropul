import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Pending extends Component {
  render() {
    return <div>
      <h2>Waiting for players...</h2>
      <br/><Link to="/solo">Go solo</Link>
    </div>;
  }
}
