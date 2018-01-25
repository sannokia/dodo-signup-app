module.exports = (app) => {
  var compress = require('compression');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var methodOverride = require('method-override');

  app.use(methodOverride());
  app.use(compress());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' })); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
};
