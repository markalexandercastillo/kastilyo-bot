const _ = require('lodash')
  , debug = require('./../debug')('cache', 'set')
  , redis = require('./redis');

const {assign} = _;
const {stringify} = JSON;
const NAMESPACE_DELIMITER = ':';

const proto = {
  getNamespacedKey(key) {
    return this.namespaces.concat([key]).join(NAMESPACE_DELIMITER);
  },
  get(key) {
    key = this.getNamespacedKey(key);
    debug(`Getting members of '${key}'`);
    return redis.smembers(key);
  },
  add(key, members) {
    key = this.getNamespacedKey(key);
    debug(`Adding members ${stringify(members)} to '${key}'`);
    return redis.sadd(key, ...members);
  },
  fetch(key, missHandler) {
    return this.get(key)
      .then(members => {
        if (members.length) return members;
        debug(`Could not find members of '${key}'`);
        return Promise.resolve(missHandler())
          .then(freshMembers => freshMembers.length
            ? this.add(key, freshMembers).return(freshMembers)
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
