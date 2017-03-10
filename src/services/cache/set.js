const _ = require('lodash')
  , debug = require('./../debug')('cache', 'hash')
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
    debug(`Getting members of '${key}'`);
    return redis.smembersAsync(key);
  },
  add(key, members) {
    key = this.getNamespacedKey(key);
    debug(`Adding members ${stringify(members)} to '${key}'`);
    return redis.saddAsync(key, ...members);
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
