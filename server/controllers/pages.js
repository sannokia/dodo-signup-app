var Pages = {
  _bootstrapApp(req, res, next) {
    req.loadAssets({ include: ['app.entry'] });
    next();
  },
  app(req, res) {
    Pages._bootstrapApp(req, res, () => {
      res.render('app');
    });
  }
};

module.exports = Pages;
