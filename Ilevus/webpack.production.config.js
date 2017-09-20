var path = require('path');
var Webpack = require("webpack");
module.exports = require("./webpack.config.js");
module.exports.output.path = path.join(__dirname, 'build', 'Release');
module.exports.devtool = null;

module.exports.plugins = [
              new Webpack.ProvidePlugin({
                  $: "jquery",
                  jQuery: "jquery"
              }),
              new Webpack.DefinePlugin({
                  'process.env': {
                      'NODE_ENV': JSON.stringify("production")                      
                  }
              })
];