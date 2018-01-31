var helmet = require('helmet');

module.exports = (app) => {
  app.use(helmet());

  if (global.config.isSecure) {
    app.use(
      helmet.hsts({
        maxAge: 15768000,
        includeSubdomains: true
      })
    );
  }
};
