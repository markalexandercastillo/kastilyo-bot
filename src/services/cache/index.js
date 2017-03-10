const redis = require('./../../helpers/redis')
  , createHash = require('./hash').create
  , createList = require('./list').create
  , createSet = require('./set').create;

function create(...namespaces) {
  return {
    hash: createHash(...namespaces),
    list: createList(...namespaces),
    set: createSet(...namespaces),
    flushAll() {
      return redis.flushallAsync();
    }
  };
}

module.exports = {
  create
};
