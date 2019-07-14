const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    target: 'web',
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
    devServer: {
        host: '127.0.0.1',
        port: 8888,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                exclude: [/node_modules/, /lib/],
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loaders: ['source-map-loader', 'babel-loader'],
                exclude: [/node_modules/, /lib/],
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
                exclude: [/node_modules/, /lib/],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader',
            },
            {
                test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
                loader: 'url-loader?prefix=font/&limit=10000',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'plume gl',
            filename: 'index.html',
            template: './template.html',
        }),
    ]
}