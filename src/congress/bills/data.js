/**
 * propublica-congress bill-related method wrappers. Coerces resolved data to bluebird promises and
 * while also plucking out relevant data from api response data structure.
 */
const _ = require('lodash')
  , Promise = require('bluebird')
  , ppc = require('./../../helpers/propublica-congress')
  , slugifyId = require('./slugifyId');

function getDetails(id, type) {
  return new Promise((resolve, reject) => {
    ppc.getAdditionalBillDetails(slugifyId(id), type)
      .then(data => resolve(data.results[0][type]))
      .catch(reject);
  });
}

module.exports = {
  get(id) {
    return new Promise((resolve, reject) => {
      ppc.getBill(slugifyId(id))
        .then(data => resolve(data.results[0]))
        .catch(reject);
    });
  },
  getRecentIds(chamber, type, offset) {
    return new Promise((resolve, reject) => {
      ppc.getRecentBills(chamber, type, {offset})
        .then(data => resolve(_.map(data.results[0].bills, 'number')))
        .catch(reject);
    });
  },
  getSubjects(id) {
    return getDetails(id, 'subjects');
  },
  getAmendments(id) {
    return getDetails(id, 'amendments');
  },
  getCosponsorIds(id) {
    return getDetails(id, 'cosponsors')
      .then(cosponsors => _.map(cosponsors, 'cosponsor_id'));
  }
};
