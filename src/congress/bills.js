const {assign, isArray} = require('lodash')
  , {all} = require('bluebird')
  , ppc = require('./propublica-congress')
  , cache = require('./../cache').create('kastilyo-bot', 'congress', 'bills')
  , members = require('./members');

function getOne(id) {
  return cache.hash.fetch(`bill-${ppc.normalizeBillId(id)}`, {
    data: () => ppc.getBill(id),
    subjects: () => ppc.getAdditionalBillDetails(id, 'subjects'),
    amendments: () => ppc.getAdditionalBillDetails(id, 'amendments'),
    cosponsors: () => ppc.getAdditionalBillDetails(id, 'cosponsors').map(({cosponsor_id}) => members.get(cosponsor_id))
  }).then(({data, subjects, amendments, cosponsors}) =>  assign(data, {
    subjects,
    amendments,
    cosponsors
  }));
}

function get(idOrIds) {
  return isArray(idOrIds) ? all(idOrIds.map(getOne)) : getOne(idOrIds);
}

function getRecent(chamber, type, offset = 0) {
  return cache.list.fetch(
    `bills-${type}-${chamber}-${offset}`,
    () => ppc.getRecentBillIds(chamber, type, offset)
  ).then(get);
}

module.exports = {
  get,
  getRecent,
  recentTypes: ppc.recentBillTypes
};
