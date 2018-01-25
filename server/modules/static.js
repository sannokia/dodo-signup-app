var express = require('express');
var path = require('path');

module.exports = (app) => {
  if (global.config.env.isDevelopment) {
    require('../lib/webpack');
    app.use(express.static(path.resolve(__dirname, '../../', 'public')));
  } else {
    app.use('/dist', express.static(path.resolve(__dirname, '../../', 'dist')));
    app.use(
      '/fonts',
      express.static(path.resolve(__dirname, '../../', 'public/fonts'))
    );
    app.use(
      '/images',
      express.static(path.resolve(__dirname, '../../', 'public/images'))
    );
  }

  app.use(
    '/static',
    express.static(path.resolve(__dirname, '../../', 'static'))
  );
};
