import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Application from './components/application/application';
import store from './store';

ReactDOM.render(
  <div>
    <Provider store={store}>
        <Application />
    </Provider>
  </div>,
  document.getElementById('root')
);
