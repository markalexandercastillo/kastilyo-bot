const _ = require('lodash')
  , tc = require('toon-caps')
  , findRandomMeme = require('./findRandomMeme');

const {assign} = _;

// morbotron and frinkiac are getters on tc so it looks like I can't just assign to those keys.
// instead i'm exporting their extended return values.
module.exports = ['morbotron', 'frinkiac']
  .reduce((extendedTc, key) => assign(extendedTc, {
    [key]: assign(tc[key], {
      findRandomMeme
    })
  }), {});
