const _ = require('lodash')
  , Promise = require('bluebird')
  , ppc = require('./../../../helpers/propublica-congress');

function getOne(id) {
  return ppc.getMember(id)
    .then(data => data.results[0]);
}

function getMany(ids) {
  return Promise.all(ids.map(getOne));
}

function get(idOrIds) {
  return _.isArray(idOrIds) ? getMany(idOrIds) : getOne(idOrIds);
}

module.exports = {
  get
};
