import path from 'path';
import { map } from './webpack.common.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  extends: path.resolve(map.configuration, './webpack.common.js'),

  entry: {
    path: path.resolve(map.test, 'static', 'index.js'),
  },

  mode: 'development',

  devtool: 'inline-source-map',

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(map.test, 'static', 'index.html'),
      filename: 'index.html',
    }),
  ],

  devServer: {
    open: false,
    port: 8000,
    static: {
      directory: path.join(map.test, 'static'),
    },
  },
};
