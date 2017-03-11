/**
 * propublica-congress member-related method wrappers. Coerces resolved data to bluebird promises
 * and while also plucking out relevant data from api response data structure.
 */
const Promise = require('bluebird')
  , ppc = require('./../../../helpers/propublica-congress');

module.exports = {
  get(id) {
    return new Promise(
      (resolve, reject) => ppc.getMember(id)
        .then(data => resolve(data.results[0]))
        .catch(reject)
    );
  },
  getIdList(chamber, offset = 0) {
    return (new Promise(
      (resolve, reject) => ppc.getMemberList(chamber, {offset})
        .then(data => resolve(data.results[0].members))
        .catch(reject)
    )).map(member =>  member.id);
  }
};
