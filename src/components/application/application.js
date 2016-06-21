import React, {Component} from 'react';
import {Router, IndexRoute, Route, hashHistory} from 'react-router';
import Layout from './application-layout';
import Landing from '../landing/landing';
import GameMultiplayer from '../game/game-multiplayer';
import GameSolo from '../game/game-solo';

export default class Application extends Component {
  render() {
    return <Router history={hashHistory}>
      <Route path="/" component={Landing} />
      <Route component={Layout}>
        <Route path="/multi" component={GameMultiplayer} />
        <Route path="/solo" component={GameSolo} />
      </Route>
    </Router>;
  }
}
