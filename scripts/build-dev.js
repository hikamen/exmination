const path = require('path');
const extracter = require('./utils/extracter');

extracter({
  src: path.resolve(__dirname, '../node_modules/zanui-weapp/dist'),
  dist: path.resolve(__dirname, '..//src/libs/zanui-weapp'),
  watch: false
});
