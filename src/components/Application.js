import React, {Component} from 'react';
import {Router, IndexRoute, Route, hashHistory} from 'react-router';
import Layout from './Layout';
import Landing from './Landing';
import Pending from './Pending';
import Solo from './Solo';

export default class Application extends Component {
  render() {
    return <Router history={hashHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={Landing} />
        <Route path="/pending" component={Pending} />
        <Route path="/solo" component={Solo} />
      </Route>
    </Router>;
  }
}
