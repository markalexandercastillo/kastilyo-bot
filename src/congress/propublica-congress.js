/**
 * propublica-congress wrapper. Only exposes ppc instance methods/pops as needed and coerces
 * data to bluebird promises and while also plucking out relevant data from api response data
 * structure.
 */

const {resolve: toBluebird} = require('bluebird')
  , ppc = require('./../helpers/propublica-congress');

const normalizeBillId = id => id.replace(/\./g, '').toLowerCase();

const getBill = id => toBluebird(
  ppc.getBill(normalizeBillId(id))
    .then(data => data.results[0])
);

const getRecentBillIds = (chamber, type, offset) => toBluebird(
  ppc.getRecentBills(chamber, type, {offset})
    .then(data => data.results[0].bills.map(({number}) => number))
);

const getAdditionalBillDetails = (id, type) => toBluebird(
  ppc.getAdditionalBillDetails(normalizeBillId(id), type)
    .then(data => data.results[0][type])
);

const getMember = id => toBluebird(
  ppc.getMember(id)
    .then(data => data.results[0])
);

const getMemberIds = (chamber, offset) => toBluebird(
  ppc.getMemberList(chamber, {offset})
    .then(data => data.results[0].members)
).map(member =>  member.id);

module.exports = {
  recentBillTypes: ppc.recentBillTypes,
  chambers: ppc.chambers,
  getBill,
  getRecentBillIds,
  getAdditionalBillDetails,
  getMember,
  getMemberIds,
  normalizeBillId
};
