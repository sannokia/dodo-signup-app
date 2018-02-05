var notifier = require('@dodo/notifier');
var pkg = require('../../package.json');

module.exports = function() {
  if (global.config.env.isDevelopment) {
    const appNotifier = notifier(pkg.title);
    appNotifier.notify({
      message: '✅ Server has started successfully'
    });
  }
};
