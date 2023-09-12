const path = require('path');

module.exports = {
  entry: './cube.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
