var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

var StatsPlugin = require('stats-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var CommonsPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var NodeSecurityPlugin = require('webpack-nodesecurity-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ImageminPlugin = require('imagemin-webpack-plugin').default;

const q = (loader, query) => {
  return loader + '?' + JSON.stringify(query);
};

const styleLoaders = [
  {
    loader: 'style-loader'
  },
  {
    loader: 'css-loader'
  },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [autoprefixer({ browsers: ['last 2 versions'] })]
    }
  },
  {
    loader: 'sass-loader',
    options: {
      outputStyle: 'expanded',
      includePaths: [
        path.resolve(__dirname, '../public'),
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../src/styles'),
        path.resolve(__dirname, '../node_modules')
      ]
    }
  }
];

module.exports = (options) => {
  options = Object.assign(
    {},
    {
      env: 'dev',
      publicPath: '/dist/',
      analyzer: false,
      minify: false
    },
    options
  );

  var envMap = {
    dev: 'development',
    prod: 'production',
    test: 'test'
  };

  var plugins = [
    new DefinePlugin({
      __DEV__: JSON.stringify(options.env === 'dev'),
      __TEST__: JSON.stringify(options.env === 'test'),
      __PROD__: JSON.stringify(options.env === 'prod'),
      __NODE__: JSON.stringify(options.target === 'node'),
      'process.env': {
        NODE_ENV: JSON.stringify(
          options.env === 'prod' ? 'production' : 'development'
        ),
        BABEL_ENV: JSON.stringify(envMap[options.env]),
        TEST: JSON.stringify(options.env === 'test')
      }
    }),
    new LodashModuleReplacementPlugin({
      shorthands: true,
      collections: true,
      memoizing: true,
      flattening: true,
      paths: true,
      caching: true
    }),
    options.env === 'dev' ? new webpack.HotModuleReplacementPlugin() : null,
    options.env === 'dev' ? new webpack.NamedModulesPlugin() : null,
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /en|fr|fi|es|nl|el/
    ),
    options.target === 'node'
      ? null
      : new CommonsPlugin({
          name: 'main',
          minChunks: 2
        }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: false
    }),
    new AssetsPlugin(),
    new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [/node_modules\/(?!@adrianbonnici)/]
    }),
    new DuplicatePackageCheckerPlugin(),
    options.analyzer ? new BundleAnalyzerPlugin() : null,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      'windows.jQuery': 'jquery'
    }),
    new NodeSecurityPlugin(),
    new CleanWebpackPlugin(
      ['dist/*.*', 'dist/**/*.*', 'public/*.*', 'public/**/*.*'],
      {
        root: process.cwd()
      }
    ),
    new CopyWebpackPlugin([
      {
        from: 'src/fonts',
        to: path.join(__dirname, '../public/fonts')
      },
      {
        from: 'src/images',
        to: path.join(__dirname, '../public/images')
      }
    ]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      jpegtran: {
        progressive: true
      }
    })
  ];

  plugins = _.compact(plugins);

  var config = {
    entry: {
      main: _.compact([
        options.env === 'dev' ? 'react-hot-loader/patch' : null,
        options.env === 'dev' ? 'webpack-hot-middleware/client' : null,
        'main'
      ]),
      'app.entry': 'app.entry'
    },

    output: {
      path: path.join(__dirname, '../dist'),
      filename: '[name].js',
      chunkFilename: '[name].[chunkhash].chunk.js',
      publicPath: options.publicPath
    },

    resolve: {
      modules: [
        __dirname,
        'public',
        'src/scripts',
        'src/styles',
        'node_modules'
      ],
      extensions: ['.js'],
      alias: {
        lodash: path.join(__dirname, '../node_modules/lodash'),
        jquery: path.join(__dirname, '../node_modules/jquery'),
        $: path.join(__dirname, '../node_modules/jquery')
      }
    },

    context: process.cwd(),

    plugins,

    module: {
      rules: _.compact([
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader'
        },
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: [
            q('babel-loader', {
              cacheDirectory: true,
              cacheIdentifier: `${process.env.BABEL_ENV}${
                process.env.NODE_ENV
              }${fs.readFileSync(
                path.resolve(__dirname, '../.babelrc'),
                'utf8'
              )}`
            })
          ]
        },
        {
          test: /\.scss$/,
          use:
            options.env === 'test'
              ? [
                  {
                    loader: path.resolve(
                      __dirname,
                      'test/helpers/noop-loader.js'
                    )
                  }
                ]
              : options.env !== 'prod'
                ? styleLoaders
                : ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?-url!postcss-loader!sass-loader'
                  })
        },
        {
          test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.eot$|\.woff$|\.ttf$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: '[path][name].[ext]',
                context: path.resolve(__dirname, '../public')
              }
            }
          ]
        }
      ])
    }
  };

  if (options.env === 'dev' || options.env === 'test') {
    config.devtool = 'eval-source-map';
    config.output.pathinfo = true;
  }

  if (options.env === 'test') {
    config.entry = {
      main: 'main',
      'index.test': 'test/index.test'
    };

    config.devtool = false;
    config.output.filename = '[name].js';
    config.output.chunkFilename = '[name].chunk.js';

    config.resolve.modules = ['test'].concat(config.resolve.modules);

    if (options.target === 'node') {
      delete config.entry.main;
      config.target = 'node';
      config.output.path = __dirname + '/test/node';
    }
  }

  if (options.env === 'prod') {
    config.profile = true;
    config.output.filename = '[name].[hash].js';
    config.output.chunkFilename = '[name].[hash].[chunkhash].chunk.js';
    config.output.publicPath = options.publicPath;

    if (options.minify) {
      plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: false,
          comments: false,
          compress: {
            screw_ie8: true,
            drop_console: true,
            warnings: false
          }
        })
      );
    }
  }

  return config;
};
