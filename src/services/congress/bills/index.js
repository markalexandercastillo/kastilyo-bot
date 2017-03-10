const _ = require('lodash')
  , Promise = require('bluebird')
  , slugifyId = require('./slugifyId')
  , data = require('./data')
  , cache = require('./../../cache').create('kastilyo-bot', 'congress', 'bills')
  , members = require('./../members');

function getDataPromises(id) {
  const cacheHashKey = `bill-${slugifyId(id)}`;
  return [
    cache.hash.fetchField(cacheHashKey, 'data', () => data.get(id)),
    cache.hash.fetchField(cacheHashKey, 'subjects', () => data.getSubjects(id)),
    cache.hash.fetchField(cacheHashKey, 'amendments', () => data.getAmendments(id)),
    cache.hash.fetchField(cacheHashKey, 'cosponsors', () => data.getCosponsorIds(id).map(members.get))
  ];
}

function mergeData([bill, subjects, amendments, cosponsors]) {
  return Object.assign(bill, {
    subjects,
    amendments,
    cosponsors
  });
}

function getOne(id) {
  return Promise.all(getDataPromises(id))
    .then(mergeData);
}

function getMany(ids) {
  return Promise.all(ids.map(getDataPromises).reduce(
      (accumulatedPromises, dataPromises) => [...accumulatedPromises, ...dataPromises],
      []
    ))
    .then(billDataComponents =>_.chunk(billDataComponents, 4))
    .map(mergeData);
}

function get(idOrIds) {
  return _.isArray(idOrIds) ? getMany(idOrIds) : getOne(idOrIds);
}

function getRecent(chamber, type, offset = 0) {
  return cache.set.fetch(
    `bills-${type}-${chamber}`,
    () => data.getRecentIds(chamber, type, offset)
  ).then(getMany);
}

module.exports = {
  get,
  getIntroduced(chamber, offset = 0) {
    return getRecent(chamber, 'introduced', offset);
  },
  getUpdated(chamber, offset = 0) {
    return getRecent(chamber, 'updated', offset);
  },
  getPassed(chamber, offset = 0) {
    return getRecent(chamber, 'passed', offset);
  },
  getMajor(chamber, offset = 0) {
    return getRecent(chamber, 'major', offset);
  }
};
