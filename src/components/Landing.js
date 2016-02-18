import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Landing extends Component {
  render() {
    return <div>
      <h2>Abstract multiplayer puzzle game.</h2>
      <Link to="/pending">Play with people</Link>
      <br/><Link to="/solo">Go solo</Link>
    </div>;
  }
}
