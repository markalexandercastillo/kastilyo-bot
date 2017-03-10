const _ = require('lodash')
  , Promise = require('bluebird')
  , data = require('./data')
  , members = require('./../members');

function getDataPromises(id) {
  return [
    data.get(id),
    data.getDetails(id, 'subjects'),
    data.getDetails(id, 'amendments'),
    data.getDetails(id, 'cosponsors').then(cosponsors => _.map(cosponsors, 'cosponsor_id')).map(members.get)
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

module.exports = {
  get,
  getIntroduced(chamber, offset = 0) {
    return data.getRecentIds(chamber, 'introduced', offset).map(get);
  },
  getUpdated(chamber, offset = 0) {
    return data.getRecentIds(chamber, 'updated', offset).map(get);
  },
  getPassed(chamber, offset = 0) {
    return data.getRecentIds(chamber, 'passed', offset).map(get);
  },
  getMajor(chamber, offset = 0) {
    return data.getRecentIds(chamber, 'major', offset).map(get);
  }
};
