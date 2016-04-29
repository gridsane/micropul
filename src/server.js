import 'babel-polyfill';
import http from 'http';
import express from 'express';
import compression from 'compression';
import socketio from 'socket.io';
import bodyParser from 'body-parser';
import path from 'path';
import initSocket from './server/socket';

const config = {
  port: parseInt(process.env.PORT || 3000),
};

const app = express();
const server = http.Server(app);
initSocket(socketio(server));

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.dev');

  webpackConfig.entry.push('webpack-hot-middleware/client');
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));

  app.use(require('webpack-hot-middleware')(compiler));
  app.get('/assets/style.css', (req, res) => res.send(''));
} else {
  app.use(compression());
}

app
  .disable('x-powered-by')
  .use(bodyParser.json())
  .use('/assets', express.static(__dirname + '/../assets'))
  .get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../index.html'));
  });

server.listen(config.port, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log("Server listening on port " + config.port);
});
