const
    path = require('path'),
    HtmlWebPackPlugin = require('html-webpack-plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        client: `${path.resolve(__dirname)}/src/js/index.js`
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: `${path.resolve(__dirname)}/src/index.html`
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    devtool: 'source-map'
};