const _ = require('lodash')
  , debug = require('./../debug')('cache', 'list')
  , redis = require('./../../helpers/redis');

const {assign} = _;
const {stringify} = JSON;
const NAMESPACE_DELIMITER = ':';

const proto = {
  getNamespacedKey(key) {
    return this.namespaces.concat([key]).join(NAMESPACE_DELIMITER);
  },
  get(key) {
    key = this.getNamespacedKey(key);
    debug(`Getting items of '${key}'`);
    return redis.lrangeAsync(key, 0, -1);
  },
  push(key, items) {
    key = this.getNamespacedKey(key);
    debug(`Pushing ${stringify(items)} for '${key}'`);
    return redis.lpushAsync(key, ...items);
  },
  fetch(key, missHandler) {
    return this.get(key)
      .then(hitItems => {
        if (hitItems.length) return hitItems;
        debug(`Could not find items of '${key}'`);
        return Promise.resolve(missHandler())
          .then(freshItems => freshItems.length
            ? this.push(key, freshItems).return(freshItems)
            : []
          );
      });
  }
};

function create(...namespaces) {
  return assign(Object.create(proto), {
    namespaces
  });
}

module.exports = {
  create
};
