var zeus = require('../zeus');

var methods = {
  public(req, res) {
    var data = req.body;

    zeus.gists.public(req, {}, data).bindDefaults(res);
  }
};

module.exports = methods;
