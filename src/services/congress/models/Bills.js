const _ = require('lodash')
  , Promise = require('bluebird')
  , ppc = require('./../../../helpers/propublica-congress')
  , Members = require('./Members');

function slugifyId(id) {
  return id.replace(/\./g, '').toLowerCase();
}

function getRecent(chamber, type, offset) {
  return ppc.getRecentBills(chamber, type, {offset})
    .then(data => _.map(data.results[0].bills, 'number'))
    .then(billNumbers => get(billNumbers));
}

function getIntroduced(chamber, offset = 0) {
  return getRecent(chamber, 'introduced', offset);
}

function getUpdated(chamber, offset = 0) {
  return getRecent(chamber, 'updated', offset);
}

function getPassed(chamber, offset = 0) {
  return getRecent(chamber, 'passed', offset);
}

function getMajor(chamber, offset = 0) {
  return getRecent(chamber, 'major', offset);
}

function getDetails(id, type) {
  return ppc.getAdditionalBillDetails(id, type)
    .then(data => data.results[0][type]);
}

function getSubjects(id) {
  return getDetails(id, 'subjects');
}

function getAmendments(id) {
  return getDetails(id, 'amendments');
}

function getCosponsors(id) {
  return getDetails(id, 'cosponsors')
    .then(cosponsors => cosponsors.map(({cosponsor_id}) => cosponsor_id))
    .then(memberIds => Members.get(memberIds));
}

function getBillDataPromises(id) {
  return [
    ppc.getBill(id).then(data => data.results[0]),
    getSubjects(id),
    getAmendments(id),
    getCosponsors(id)
  ];
}

function mergeBillData([bill, subjects, amendments, cosponsors]) {
  return Object.assign(bill, {
    subjects,
    amendments,
    cosponsors
  });
}

function getOne(id) {
  id = slugifyId(id);
  return Promise.all(getBillDataPromises(id))
  .then(mergeBillData);
}

function getMany(ids) {
  // promises for all data for the given ids
  const billDataPromises = _(ids)
    .map(id => getBillDataPromises(slugifyId(id)))
    .flatten()
    .value();

  return Promise.all(billDataPromises)
    .then(billDataComponents =>_.chunk(billDataComponents, 4))
    .map(mergeBillData);
}

function get(idOrIds) {
  return _.isArray(idOrIds) ? getMany(idOrIds) : getOne(idOrIds);
}

module.exports = {
  get,
  getIntroduced,
  getUpdated,
  getPassed,
  getMajor
};
