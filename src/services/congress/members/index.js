const _ = require('lodash')
  , Promise = require('bluebird')
  , cache = require('./../../cache').create('kastilyo-bot', 'congress', 'members')
  , data = require('./data');

function getOne(id) {
  const key = `member-${id}`;
  return cache.hash.get(key)
    .then(member => {
      if (member) return member;
      data.get(id).then(freshMember => cache.hash.set(key, freshMember).return(freshMember)); 
    });
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
