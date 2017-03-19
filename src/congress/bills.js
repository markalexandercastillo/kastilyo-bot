const _ = require('lodash')
  , Promise = require('bluebird')
  , ppc = require('./propublica-congress')
  , cache = require('./../cache').create('kastilyo-bot', 'congress', 'bills')
  , members = require('./members');

function getData(id) {
  return cache.hash.fetch(`bill-${ppc.normalizeBillId(id)}`, {
    data: () => ppc.getBill(id),
    subjects: () => ppc.getAdditionalBillDetails(id, 'subjects'),
    amendments: () => ppc.getAdditionalBillDetails(id, 'amendments'),
    cosponsors: () => ppc.getAdditionalBillDetails(id, 'cosponsors').map(({cosponsor_id}) => members.get(cosponsor_id))
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
  return cache.list.fetch(
    `bills-${type}-${chamber}-${offset}`,
    () => ppc.getRecentBillIds(chamber, type, offset)
  ).then(getMany);
}

module.exports = {
  get,
  getRecent,
  recentTypes: ppc.recentBillTypes
};
