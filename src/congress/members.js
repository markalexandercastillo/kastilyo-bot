const {isArray, assign} = require('lodash')
  , {all} = require('bluebird')
  , cache = require('./../cache').create('kastilyo-bot', 'congress', 'members')
  , ppc = require('./propublica-congress');

async function getOne(id) {
  const {data} = await cache.hash.fetch(`member-${id}`, {
    data: () => ppc.getMember(id)
  });

  return assign(data, {});
}

function getList(chamber, offset = 0) {
  const key = `members-${chamber}-${offset}`;
  return cache.list.fetch(key, () => ppc.getMemberIds(chamber, offset))
    .map(getOne);
}

function get(idOrIds) {
  return isArray(idOrIds) ? all(idOrIds.map(getOne)) : getOne(idOrIds);
}

module.exports = {
  get,
  getList
};
