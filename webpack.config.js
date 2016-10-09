var path = require('path');

module.exports = {
  context: path.join(__dirname, 'client'),
  entry: {
    javascript: './app.js',
    html: './index.html'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: require.resolve("react"), loader: "expose?React" },
      { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.js$/, loader: 'babel' },
      { test: /\.html$/, loader: 'file?name=[name].[ext]' },
      { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  devServer: {
    historyApiFallback: true
  }
};