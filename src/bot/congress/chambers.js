const {assign} = require('lodash');
module.exports = assign(['house', 'senate'], {
  contains(test) {
    return this.indexOf(test) > -1;
  }
});
