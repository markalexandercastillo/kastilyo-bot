const bot = require('./../helpers/telegram');
const tc = require('./toon-caps');
const congress = require('./congress');

tc.extend(bot);
congress.extend(bot);
