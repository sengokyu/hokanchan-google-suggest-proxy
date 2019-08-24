const path = require('path');
const AwsSamPlugin = require('aws-sam-webpack-plugin');
const awsSamPlugin = new AwsSamPlugin();

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  entry: awsSamPlugin.entry(),
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: '[name]/app.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '.aws-sam/build/')
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [awsSamPlugin]
};
