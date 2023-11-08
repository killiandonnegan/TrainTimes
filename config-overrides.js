//modify Webpack configuration - create react app abstracts away webpack configuration
//so need this file to override and make necessary modifications to webpack
const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  // Add a fallback configuration for timers
  config.resolve.fallback = {
    timers: require.resolve('timers-browserify'),
    stream: require.resolve('stream-browserify'), // Add a fallback for the "stream" module
  };

  return config;
};
