var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = [
  {
    test: /\.jsx$/,
    exclude: [node_modules_dir],
    loader: "babel-loader",
    query: {
      presets: ['es2015', 'react']
    }
  }, {
    test: /\.scss$/,
    loader: "style-loader!css-loader!postcss-loader!sass-loader"
  }, {
    test: /\.css$/,
    loader: "style-loader!css-loader!postcss-loader"
  }, {
    test: /\.html$|\.ico$/,
    loader: "file?name=[name].[ext]"
  }, {
    test: /\.(woff|woff2)$/,
    loader: "url-loader?limit=10000&mimetype=application/font-woff"
  }, {
    test: /\.ttf$|\.eot$|\.svg$|\.png$|\.jpe?g$|\.gif$/,
    loader: "file-loader?name=/images/[name].[ext]"
  }, {
    test: /\.md$/,
    loader: "raw-loader"
  }, {
    test: /\.json$/,
    loader: "json-loader"
  }];