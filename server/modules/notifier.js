var notifier = require('../lib/notifier');

module.exports = function() {
  if (global.config.env.isDevelopment || global.config.env.isTest) {
    notifier.notify({
      message: '✅ Server has started successfully'
    });
  }
};
