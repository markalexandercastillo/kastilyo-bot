const _ = require('lodash')
  , Promise = require('bluebird')
  , cache = require('./../../cache').create('kastilyo-bot', 'congress', 'members')
  , data = require('./data');

function getOne(id) {
  const key = `member-${id}`;
  return cache.hash.fetchField(key, 'data', () => data.get(id));
}

function getMany(ids) {
  return Promise.all(ids.map(getOne));
}

function get(idOrIds) {
  return _.isArray(idOrIds) ? getMany(idOrIds) : getOne(idOrIds);
}

module.exports = {
  get
};
