var express = require('express');
var path = require('path');

module.exports = (app) => {
  var getStaticDirectory = (relativePath) => {
    return path.resolve(__dirname, '../../', relativePath);
  };

  if (global.config.env.isDevelopment) {
    require('../lib/webpack');
    app.use(express.static(getStaticDirectory('public')));
  } else {
    app.use('/dist', express.static(getStaticDirectory('dist')));
    app.use(
      '/fonts',
      express.static(path.resolve(getStaticDirectory('public/fonts')))
    );
    app.use(
      '/images',
      express.static(path.resolve(getStaticDirectory('public/images')))
    );
  }

  app.use(
    '/static',
    express.static(path.resolve(getStaticDirectory('static')))
  );
};
