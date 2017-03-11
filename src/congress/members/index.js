const _ = require('lodash')
  , Promise = require('bluebird')
  , cache = require('./../../cache').create('kastilyo-bot', 'congress', 'members')
  , data = require('./data');

function getOne(id) {
  const key = `member-${id}`;
  return cache.hash.fetchField(key, 'data', () => data.get(id));
}

function getList(chamber, offset = 0) {
  const key = `members-${chamber}-${offset}`;
  return cache.list.fetch(key, () => data.getIdList(chamber, offset))
    .map(getOne);
}

function getMany(ids) {
  return Promise.all(ids.map(getOne));
}

function get(idOrIds) {
  return _.isArray(idOrIds) ? getMany(idOrIds) : getOne(idOrIds);
}

module.exports = {
  get,
  getList
};
