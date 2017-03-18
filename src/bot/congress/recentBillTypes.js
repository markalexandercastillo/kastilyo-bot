const {assign} = require('lodash');
module.exports = assign(['updated', 'introduced', 'major', 'passed'], {
  contains(test) {
    return this.indexOf(test) > -1;
  }
});
