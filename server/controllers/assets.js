var reload = require('require-reload')(require);
var _ = require('lodash');

var assets = {};

_.attempt(function() {
  assets = require('../../webpack-assets.json');
});

var Assets = {
  getAssetUrl(name) {
    if (global.config.env.isDevelopment) {
      _.attempt(function() {
        assets = reload('../../webpack-assets.json');
      });
    }

    return _.get(assets, name);
  },
  getAssets(name) {
    var assets = Assets.getAssetUrl.apply(this, arguments);

    return _.map(assets, (url, type) => {
      return {
        type,
        name,
        url
      };
    });
  },
  loadAssets(req, res) {
    req.loadAssets = (options) => {
      var defaultAssetNames = ['main'];

      options = Object.assign(
        {},
        {
          include: [],
          exclude: []
        },
        options || {}
      );

      // Assets = default + include - exclude
      var pageAssetNames = _(defaultAssetNames)
        .union(options.include)
        .difference(options.exclude)
        .compact()
        .value();

      // Group all assets by type
      var pageAssets = _(pageAssetNames)
        .map(Assets.getAssets)
        .flatten()
        .groupBy('type')
        .value();

      global.log.info('Page Assets for ' + req.url, pageAssets);

      res.locals.pageAssets = pageAssets;

      return pageAssets;
    };
  }
};

module.exports = Assets;
