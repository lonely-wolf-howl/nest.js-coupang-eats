module.exports = function (options) {
  return {
    ...options,
    devtool: 'source-map',
    watchOptions: {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    },
  };
};
