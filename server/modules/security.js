var helmet = require('helmet');

module.exports = (app) => {
  // app.use(helmet.contentSecurityPolicy());
  app.use(helmet.dnsPrefetchControl());

  app.use(helmet.hidePoweredBy());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());

  if (global.config.isSecure) {
    app.use(
      helmet.hsts({
        maxAge: 15768000,
        includeSubdomains: true
      })
    );
  }
};
