var path = require('path');
var Webpack = require("webpack");
var autoprefixer = require("autoprefixer");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var loaders = require('./webpack.loaders');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    context: __dirname,
    devtool: 'source-map',
    entry: {
        javascript: path.join(__dirname, "jsx", "app.js")
    },
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devServer: {
        "proxy": {
            "/api/": {
                "target": 'http://localhost:57141/api/',
                "pathRewrite": { '^/api/': '' },
                "changeOrigin": true,
                "secure": false
            }
        }
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".jsx"],
        alias: {
            "ilevus": __dirname,
            "jquery.ui.widget": "./vendor/jquery.ui.widget.js",
            "jquery-ui/widget": "./vendor/jquery.ui.widget.js",
            "jquery-ui/ui/widget": "./vendor/jquery.ui.widget.js",
            moment$: 'moment/moment.js',
        }
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8880,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info'
        }),
        new Webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Popper: ['popper.js', 'default'],
        }),
        new Webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        }),
        new Webpack.optimize.OccurrenceOrderPlugin(),
        new Webpack.optimize.ModuleConcatenationPlugin(),
        new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new Webpack.ContextReplacementPlugin(/^\.\/locale$/, context => {
            if (!/\/moment\//.test(context.context)) {
                return;
            }
            Object.assign(context, {
                regExp: /en-us|pt-br|es/,
                request: "../../locale",
            });
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                parallel: true,
                sourceMap: true,
                ie8: false,
                ecma: 8,
                output: {
                    comments: false,
                    beautify: false,
                },
                warnings: false
            }
        }),
        new Webpack.LoaderOptionsPlugin({
        options: {
            context: __dirname,
            postcss: [
                autoprefixer
            ]
        }
    })
    ],
    module: {
        loaders
    }
};