var path = require('path');
var hbs = require('hbs');

module.exports = (app) => {
  app.set('view engine', 'html');

  app.set('views', path.resolve(__dirname, '../views'));

  app.engine('html', hbs.__express);
};
