var notifier = require('../lib/notifier');

module.exports = function() {
  if (global.config.env.isDevelopment) {
    notifier.notify({
      message: '✅ Server has started successfully'
    });
  }
};
