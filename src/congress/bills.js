const {assign, isArray} = require('lodash')
  , {all} = require('bluebird')
  , ppc = require('./propublica-congress')
  , cache = require('./../cache').create('kastilyo-bot', 'congress', 'bills')
  , members = require('./members');

async function getOne(id) {
  const {
    data,
    subjects,
    amendments,
    cosponsors
  } = await cache.hash.fetch(`bill-${ppc.normalizeBillId(id)}`, {
    data: () => ppc.getBill(id),
    subjects: () => ppc.getAdditionalBillDetails(id, 'subjects'),
    amendments: () => ppc.getAdditionalBillDetails(id, 'amendments'),
    cosponsors: () => ppc.getAdditionalBillDetails(id, 'cosponsors').map(({cosponsor_id}) => members.get(cosponsor_id))
  });

  return assign(data, {
    subjects,
    amendments,
    cosponsors
  });
}

function get(idOrIds) {
  return isArray(idOrIds) ? all(idOrIds.map(getOne)) : getOne(idOrIds);
}

async function getRecent(chamber, type, offset = 0) {
  return get(await cache.list.fetch(
    `bills-${type}-${chamber}-${offset}`,
    () => ppc.getRecentBillIds(chamber, type, offset)
  ));
}

module.exports = {
  get,
  getRecent,
  recentTypes: ppc.recentBillTypes
};
