const _ = require('lodash')
  , Promise = require('bluebird')
  , slugifyId = require('./slugifyId')
  , data = require('./data')
  , cache = require('./../../cache').create('kastilyo-bot', 'congress', 'bills')
  , members = require('./../members');

function getData(id) {
  return cache.hash.fetch(`bill-${slugifyId(id)}`, {
    data: () => data.get(id),
    subjects: () => data.getSubjects(id),
    amendments: () => data.getAmendments(id),
    cosponsors: () => data.getCosponsorIds(id).map(members.get)
  });
}

function mergeData({data, subjects, amendments, cosponsors}) {
  return Object.assign(data, {
    subjects,
    amendments,
    cosponsors
  });
}

function getOne(id) {
  return getData(id)
    .then(mergeData);
}

function getMany(ids) {
  return Promise.all(ids.map(getOne));
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
