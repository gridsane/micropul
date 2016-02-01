import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const config = {
  port: parseInt(process.env.PORT || 3000),
};

const app = express();

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
}

app
  .use(bodyParser.json())
  .use('/assets', express.static(__dirname + '/../assets'))
  .get('/', (req, res) => {
    res.sendfile(path.resolve(__dirname + '/../index.html'));
  })
  .listen(config.port, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("Server listening on port " + config.port);
  });
