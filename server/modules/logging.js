var Logger = require('@dodo/logger');
var expressWinston = require('express-winston');

module.exports = function(app) {
  var logger = Logger.createLogger();

  global.log = app.log = logger;

  var accessLg = Logger.createLogger({
    name: 'access',
    console: false
  });

  var zeusLg = Logger.createLogger({
    name: 'zeus',
    consoleJSON: true,
    consoleJSONstringify: true
  });

  logger.zeus = zeusLg;

  app.use(require('morgan')('dev'));

  app.use(
    expressWinston.logger({
      winstonInstance: accessLg
    })
  );
};
