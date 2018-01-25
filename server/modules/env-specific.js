var errorHandler = require('errorhandler');

module.exports = (app) => {
  if (global.config.env.isDevelopment) {
    app.enable('verbose errors');
    app.use(errorHandler());
  } else {
    app.disable('verbose errors');
  }
};
