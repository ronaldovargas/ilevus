// https://github.com/diegohaz/arc/wiki/Webpack
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const devServer = require('@webpack-blocks/dev-server2')
const splitVendor = require('webpack-blocks-split-vendor')
const happypack = require('webpack-blocks-happypack')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {
  addPlugins, createConfig, entryPoint, env, setOutput,
    sourceMaps, defineConstants, webpack,
} = require('@webpack-blocks/webpack2')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000
const sourceDir = process.env.SOURCE || 'src'
const publicPath = `/${process.env.PUBLIC_PATH || ''}/`.replace('//', '/')
const sourcePath = path.join(process.cwd(), sourceDir)
const outputPath = path.join(process.cwd(), 'dist')

const babel = () => () => ({
    module: {
        rules: [
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
            }
        ],
    },
})

const assets = () => () => ({
    module: {
        rules: [
            { test: /\.(md|gif|png|jpe?g|svg|woff2?|ttf|eot)$/, loader: 'url-loader?limit=8000' },
        ],
    },
})

const resolveModules = modules => () => ({
    resolve: {
        modules: [].concat(modules, ['node_modules']),
        alias: {
            "ilevus": __dirname + "/legacy",
            "jquery.ui.widget": "./vendor/jquery.ui.widget.js",
            "jquery-ui/widget": "./vendor/jquery.ui.widget.js",
            "jquery-ui/ui/widget": "./vendor/jquery.ui.widget.js",
            "config": path.join(__dirname, "src", "config.js"),
            moment$: 'moment/moment.js',
        }
    },
})

const config = createConfig([
    entryPoint({
        app: sourcePath,
    }),
    setOutput({
        filename: '[name].js',
        path: outputPath,
        publicPath,
    }),
    defineConstants({
        'process.env.NODE_ENV': process.env.NODE_ENV,
        'process.env.PUBLIC_PATH': publicPath.replace(/\/$/, ''),
    }),
    addPlugins([
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(process.cwd(), 'public/index.html'),
        }),
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
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Popper: ['popper.js', 'default'],
            PropTypes: 'prop-types',
            createClass: 'create-react-class',
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.ContextReplacementPlugin(/^\.\/locale$/, context => {
            if (!/\/moment\//.test(context.context)) {
                return;
            }
            Object.assign(context, {
                regExp: /en-us|pt-br|es/,
                request: "../../locale",
            });
        })
    ]),
    happypack([
        babel(),
    ]),
    assets(),
    resolveModules(sourceDir),
    env('development', [
        devServer({
            "proxy": {
                "/api/": {
                    "target": 'http://localhost:57141/api/',
                    "pathRewrite": { '^/api/': '' },
                    "changeOrigin": true,
                    "secure": false
                }
            },
            contentBase: 'public',
            stats: 'errors-only',
            historyApiFallback: { index: publicPath },
            host,
            port,
        }),
        sourceMaps(),
        addPlugins([
            new webpack.NamedModulesPlugin(),
        ]),
    ]),

    env('production', [
        splitVendor(),
        addPlugins([
            new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
        ]),
    ]),
])

module.exports = config

// module.exports = {
//     context: __dirname,
//     devtool: 'source-map',
//     entry: [
//         'react-hot-loader/patch',
//         path.join(__dirname, "/src/client.js")
//     ],
//     output: {
//         path: __dirname,
//         filename: "bundle.js"
//     },
//     devServer: {
//         "proxy": {
//             "/api/": {
//                 "target": 'http://localhost:57141/api/',
//                 "pathRewrite": { '^/api/': '' },
//                 "changeOrigin": true,
//                 "secure": false
//             }
//         }
//     },
//     resolve: {
//         extensions: [".webpack.js", ".web.js", ".js", ".jsx"],
//         alias: {
//             "ilevus": __dirname + "/legacy",
//             "jquery.ui.widget": "./vendor/jquery.ui.widget.js",
//             "jquery-ui/widget": "./vendor/jquery.ui.widget.js",
//             "jquery-ui/ui/widget": "./vendor/jquery.ui.widget.js",
//             moment$: 'moment/moment.js',
//         }
//     },
//     plugins: [
//         new BundleAnalyzerPlugin({
//             analyzerMode: 'server',
//             analyzerHost: '127.0.0.1',
//             analyzerPort: 8880,
//             reportFilename: 'report.html',
//             defaultSizes: 'parsed',
//             openAnalyzer: true,
//             generateStatsFile: false,
//             statsFilename: 'stats.json',
//             statsOptions: null,
//             logLevel: 'info'
//         }),
//         new Webpack.ProvidePlugin({
//             $: "jquery",
//             jQuery: "jquery",
//             Popper: ['popper.js', 'default'],
//         }),
//         new Webpack.DefinePlugin({
//             'process.env': {
//                 'NODE_ENV': JSON.stringify('development')
//             }
//         }),
//         new Webpack.optimize.OccurrenceOrderPlugin(),
//         new Webpack.optimize.ModuleConcatenationPlugin(),
//         new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
//         new Webpack.ContextReplacementPlugin(/^\.\/locale$/, context => {
//             if (!/\/moment\//.test(context.context)) {
//                 return;
//             }
//             Object.assign(context, {
//                 regExp: /en-us|pt-br|es/,
//                 request: "../../locale",
//             });
//         }),
//         new Webpack.NamedModulesPlugin(),
//         new Webpack.HotModuleReplacementPlugin(),
//         new Webpack.LoaderOptionsPlugin({
//             options: {
//                 context: __dirname,
//                 postcss: [
//                     autoprefixer
//                 ]
//             }
//         })
//     ],
//     module: {
//         loaders
//     }
// };