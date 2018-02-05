var Zeus = require('@dodo/zeus');

var dict = require('./settings/apidict');

var zeus = new Zeus({
  api: global.app.get('api'),
  dict
});

module.exports = zeus;
