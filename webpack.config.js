const path = require("path");
const webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, "js", "app.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css','.jpg','.png','.jpeg']
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js",
    publicPath: "/",
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: './'
  },
  watch: true
};