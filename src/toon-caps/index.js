const _ = require('lodash')
  , tc = require('toon-caps')
  , findRandomMeme = require('./findRandomMeme');

const {assign} = _;

module.exports = ['morbotron', 'frinkiac']
  .reduce((extendedTc, key) => assign(extendedTc, {
    [key]: assign(tc[key], {
      findRandomMeme
    })
  }), {});
