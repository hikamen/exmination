const path = require('path');
const extracter = require('./utils/extracter');

extracter({
  src: path.resolve(__dirname, '../node_modules/weui-wxss/dist/style'),
  dist: path.resolve(__dirname, '..//src/style'),
  watch: false
});
