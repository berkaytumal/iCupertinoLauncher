const path = require('path');

const mode = 'development';

module.exports = {
  mode,
  entry: {
    main: './assets/scripts/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: './script.js',
  }
};
