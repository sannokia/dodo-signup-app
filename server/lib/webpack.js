var webpack = require('webpack');
var _ = require('lodash');
var chalk = require('chalk');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var Config = require('../../config/make-webpack-config');

var notifier = require('./notifier');

var config;

if (global.config.env.isTest) {
  config = Config({ env: 'test' });
} else {
  config = Config({ env: 'dev' });
}

var compiler = webpack(config);

var webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
  contentBase: __dirname,
  noInfo: false,
  quiet: true,
  logLevel: 'silent',
  publicPath: config.output.publicPath,
  open: false,
  stats: {
    colors: true
  }
});

compiler.apply(
  new ProgressBarPlugin({
    clear: true
  })
);

var cleanError = function(err) {
  return chalk.red(err.message);
};

var onFail = function(errors) {
  notifier.notify({
    message: '😭 Webpack compilation error 😭'
  });
  _.each(errors, (err) => {
    console.log(chalk.red('--- Webpack compilation error ---\n'));
    console.log(cleanError(err));
  });
};
compiler.plugin('done', function(data) {
  var time = data.endTime - data.startTime;
  notifier.notify({
    message: '🎁 \u00A0Bundle is ready!\u00A0' + time + 'ms\u00A0 🎁'
  });
  if (data.compilation.errors && data.compilation.errors.length) {
    onFail(data.compilation.errors);
  }
});
compiler.plugin('failed', function(err) {
  onFail([err]);
});
compiler.plugin('invalid', function() {
  notifier.notify({
    message: '😱 Bundle is invalid. Compiling...😈'
  });
});
app.use(webpackDevMiddleware);
if (!global.config.env.isTest) {
  app.use(
    require('webpack-hot-middleware')(compiler, {
      log: console.log,
      path: '/__webpack_hmr'
    })
  );
}
