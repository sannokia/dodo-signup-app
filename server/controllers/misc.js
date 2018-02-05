var _ = require('lodash');

var methods = {
  _sortQs(originalQs, baseQs) {
    var sortQs = {};
    var newQs = {};
    var sortStr;

    if (baseQs) {
      _.extend(sortQs, baseQs);
    }

    if (originalQs.sortBy && originalQs.direction) {
      sortQs[originalQs.sortBy] = originalQs.direction;
    }

    sortStr = _.map(sortQs, function(val, key) {
      return key + ' ' + val;
    }).join(',');

    _.extend(newQs, originalQs);

    if (sortStr) {
      _.extend(newQs, { sort: sortStr });
    }

    delete newQs.sortBy;
    delete newQs.direction;

    return newQs;
  }
};

module.exports = methods;
