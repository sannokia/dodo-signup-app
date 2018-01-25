var nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase();
var appEnv = (process.env.APP_ENV || 'development').toLowerCase();

var config = require(`./settings/${appEnv}.json`);

config = Object.assign({}, config, {
  env: {
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: process.env.TEST_MODE === 'true',
    node: nodeEnv,
    appEnv
  }
});

module.exports = config;
