var express = require('express');
var http = require('http');

var app = express();
var config = require('./config');

global.app = app;
global.config = config;

require('./modules/greeting')();
require('./modules/logging')(app);
require('./modules/views')(app);
require('./modules/middleware')(app);
require('./modules/static')(app);
require('./modules/env-specific')(app);
require('./modules/security')(app);
require('./routes')(app);
require('./modules/notifier')();

app.set('port', process.env.PORT || global.config.port || 5000);

global.log.info('Starting App');
global.log.info('Node Environment: ' + global.config.env.node);
global.log.info('Settings loaded', Object.assign({}, { config }));

http.createServer(app).listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);

  app.emit('server:started');
});

process.on('uncaughtException', function(err) {
  console.error(`Uncaught process exception: ${err}`);
  console.trace(err.stack);
});

module.exports = app;
