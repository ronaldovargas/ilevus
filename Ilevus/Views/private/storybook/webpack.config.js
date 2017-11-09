const baseConfig = require('../../webpack.config')

module.exports = storybookBaseConfig =>
  Object.assign({}, storybookBaseConfig, {
    entry: Object.assign({}, storybookBaseConfig.entry, {
      preview: ['babel-polyfill'].concat(storybookBaseConfig.entry.preview),
    }),
    resolve: Object.assign({}, storybookBaseConfig.resolve, {
      modules: baseConfig.resolve.modules,
      alias: baseConfig.resolve.alias,
    }),
    module: Object.assign({}, storybookBaseConfig.module, {
      rules: storybookBaseConfig.module.rules.concat([
        { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
        {
          test: /\.scss$/,
          loader: "style-loader!css-loader!postcss-loader!sass-loader"
        },
        {
          test: /\.css$/,
          loader: "style-loader!css-loader!postcss-loader"
        },
        {
          test: /\.json$/,
          loader: "json-loader"
        },
        {
          test: /\.(md|gif|png|jpe?g|svg|woff2?|ttf|eot)$/,
          loader: 'url-loader?limit=8000'
        }
      ]),
    }),
  })
