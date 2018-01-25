if (!global.config.env.isDevelopment && !global.config.env.isTest) {
  module.exports = {
    notify() {}
  };
} else {
  var notifier = require('node-notifier');
  var pkg = require('../../package.json');

  var notify = notifier.notify;

  var defaults = {
    title: pkg.title
  };

  notifier.notify = function(options) {
    return notify.call(notifier, Object.assign({}, defaults, options));
  };

  module.exports = notifier;
}
