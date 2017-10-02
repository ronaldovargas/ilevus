var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var Webpack = require("webpack");
var autoprefixer = require("autoprefixer");

module.exports = {
    context: __dirname,
    devtool: 'cheap-module-source-map',
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
        extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"],
    	alias: {
    		"ilevus": __dirname,
    		"jquery.ui.widget": "./vendor/jquery.ui.widget.js",
    		"jquery-ui/widget": "./vendor/jquery.ui.widget.js",
    		"jquery-ui/ui/widget": "./vendor/jquery.ui.widget.js"
    	}
    },
    plugins: [
              new Webpack.ProvidePlugin({
                  $: "jquery",
                  jQuery: "jquery",
                  'Popper': 'popper.js'
              }),
              new Webpack.DefinePlugin({
                  'process.env': {
                      'NODE_ENV': JSON.stringify('development')
                  }
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

        },
            { test: /\.js$/, loader: 'babel-loader', exclude: [node_modules_dir] },
        {
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
        	loader: "file-loader?name=images/[name].[ext]"
        },{
            test: /\.md$/,
            loader: "raw-loader"
        },{
	    test: /\.json$/,
            loader: "json-loader"
	}]
    }
};
