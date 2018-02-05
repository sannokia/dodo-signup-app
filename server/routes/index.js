var pages = require('../controllers/pages');
var assets = require('../controllers/assets');
var gists = require('../controllers/gists');

module.exports = (app) => {
  var apiPrefix = '/__api';

  app.get(`${apiPrefix}/gists`, gists.public);

  app.use(function(req, res, next) {
    assets.loadAssets(req, res);
    next();
  });

  app.get('/', pages.app);

  app.use(function(req, res) {
    res.sendStatus(400);
  });

  app.use(function(err, req, res) {
    res.sendStatus(500);
    throw err;
  });
};
