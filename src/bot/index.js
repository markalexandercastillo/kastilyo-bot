const bot = require('./../bot-stream');
const tc = require('./toon-caps');
const congress = require('./congress');
const cache = require('./cache');

tc.extend(bot);
congress.extend(bot);
cache.extend(bot);
