import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Game from './components/Game';
import store from './store';

ReactDOM.render(
  <div>
    <Provider store={store}>
      <div>
        <Game />
      </div>
    </Provider>
  </div>,
  document.getElementById('root')
);
