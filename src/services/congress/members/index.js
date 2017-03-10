const _ = require('lodash')
  , Promise = require('bluebird')
  , data = require('./data');

function getMany(ids) {
  return Promise.all(ids.map(data.get));
}

function get(idOrIds) {
  return _.isArray(idOrIds) ? getMany(idOrIds) : data.get(idOrIds);
}

module.exports = {
  get
};
