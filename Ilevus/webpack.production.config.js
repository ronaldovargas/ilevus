var path = require('path');
module.exports = require("./webpack.config.js");
module.exports.output.path = path.resolve(__dirname, 'build/Release');
module.exports.devtool = null;