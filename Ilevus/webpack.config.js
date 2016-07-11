var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var Webpack = require("webpack");
var autoprefixer = require("autoprefixer");

module.exports = {
    context: __dirname,
    devtool: '#source-map',
    entry: {
        javascript: path.join(__dirname, "jsx", "app.js"),
        html: path.join(__dirname, "index.html"),
        icon: path.join(__dirname, 'img', 'favicon.ico')
    },
    output: {
        path: path.join(__dirname, 'build', 'Debug'),
        filename: "bundle.js"
    },
    resolve: {
    	alias: {
    		"ilevus": __dirname,
    		"jquery.ui.widget": "./vendor/jquery.ui.widget.js"
    	}
    },
    plugins: [
              new Webpack.ProvidePlugin({
                  $: "jquery",
                  jQuery: "jquery"
              })
    ],
    postcss: function () {
        return [autoprefixer];
    },
    module: {
        loaders: [{
            test: /\.jsx$/,
            exclude: [node_modules_dir],
            loader: "babel-loader",
            query: {
                presets: ['es2015','react']
            }
        },{
            test: /\.scss$/,
            loader: "style-loader!css-loader!postcss-loader!sass-loader"
        },{
        	test: /\.css$/,
        	loader: "style-loader!css-loader!postcss-loader"
        },{
        	test: /\.html$|\.ico$/,
        	loader: "file?name=[name].[ext]"
        },{
        	test: /\.(woff|woff2)$/,
        	loader: "url-loader?limit=10000&mimetype=application/font-woff"
        },{
        	test: /\.ttf$|\.eot$|\.svg$|\.png$|\.jpe?g$|\.gif$/,
        	loader: "file-loader"
        }, {
            test: /\.md$/,
            loader: "raw-loader"
        }]
    }
};
