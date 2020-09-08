const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8080,
    hot: true,
    hotOnly: true,
    proxy: {
      "/api": {
        target: "https://server1.backend.topviewclub.cn",
        secure: false
      }
    }
  },
  module: {
    rules: [{
        test: /\.(htm|html)$/i,
        use: [{
          loader: 'html-loader',
          options: {
            attributes: true
          }
        }]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      //url-loader是基于file-loader的，用了url-loader则无需配置，但注意任要下载
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            // placehoader 占位符, 不配置默认为哈希值
            name: '[name].[ext]',
            outputPath: 'images/', // 图片在dist目录中的存放位置
          }
        }]
      },
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: [{
      //     loader: 'file-loader',
      //     options: {
      //       // placehoader 占位符, 不配置默认为哈希值
      //       name: '[name].[ext]',
      //       outputPath: 'images/', // 图片在dist目录中的存放位置
      //     }
      //   }]
      // }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: true,
      verbose: false,
      cleanStaleWebpackAssets: true
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/build.css'
    })
  ]
}