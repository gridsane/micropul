import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Application from './components/Application';
import store from './store';

window.actions = require('./actions/game');
window.store = store;

ReactDOM.render(
  <div>
    <Provider store={store}>
        <Application />
    </Provider>
  </div>,
  document.getElementById('root')
);
