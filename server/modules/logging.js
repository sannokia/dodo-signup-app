var Logger = require('@dodo/logger');
var logger = require('morgan');
var expressWinston = require('express-winston');

module.exports = function(app) {
  var lg = Logger.createLogger();

  global.log = lg;
  app.log = log;

  var accessLg = Logger.createLogger({
    name: 'access',
    console: false
  });

  app.use(logger('dev'));

  app.use(
    expressWinston.logger({
      winstonInstance: accessLg
    })
  );
};
