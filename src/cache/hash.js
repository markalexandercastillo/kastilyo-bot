const _ = require('lodash')
  , Promise = require('bluebird')
  , debug = require('./../debug')('cache', 'hash')
  , redis = require('./redis');

const {keys:fields, difference, flatten, assign, mapValues} = _;
const {stringify, parse} = JSON;
const NAMESPACE_DELIMITER = ':';

const proto = {
  getNamespacedKey(key) {
    return this.namespaces.concat([key]).join(NAMESPACE_DELIMITER);
  },
  get(key) {
    key = this.getNamespacedKey(key);
    debug(`Getting data for '${key}'`);
    return redis.hgetall(key);
  },
  set(key, data) {
    key = this.getNamespacedKey(key);
    debug(`Setting ${stringify(data)} for '${key}'`);
    return redis.hmset(
      key,
      ...flatten(fields(data).map(field => [field, stringify(data[field])]))
    );
  },
  fetch(key, missHandlers) {
    debug(`Fetching data for '${this.getNamespacedKey(key)}'`);
    return redis.hgetall(this.getNamespacedKey(key))
      .then(hitData => {
        hitData = mapValues(hitData, parse) || {};
        debug(`Got ${stringify(hitData)} for '${this.getNamespacedKey(key)}'`);
        const missedFields = difference(fields(missHandlers), fields(hitData));
        if (!missedFields.length) return hitData;
        debug(`Could not find ${stringify(missedFields)} for '${key}'`);
        return Promise.props(missedFields.reduce((accPromiseProps, field) => assign(accPromiseProps, {
          [field]: missHandlers[field]()
        }), {}))
          .then(freshData => this.set(key, freshData).return(assign(hitData, freshData)));
      });
  },
  setField(key, field, data) {
    key = this.getNamespacedKey(key);
    debug(`Setting ${stringify(data)} for '${key}.${field}'`);
    return redis.hset(key, field, stringify(data));
  },
  getField(key, field) {
    key = this.getNamespacedKey(key);
    debug(`Getting '${key}.${field}'`);
    return redis.hget(key, field).then(parse);
  },
  fetchField(key, field, missHandler) {
    return this.getField(key, field)
      .then(data =>{
        debug(`Got ${stringify(data)} for '${this.getNamespacedKey(key)}.${field}'`);
        if (data) return data;
        return Promise.resolve(missHandler())
          .then(data => this.setField(key, field, data).return(data));
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
