const bot = require('./../helpers/telegram')
  , tc = require('./toon-caps')
  , congress = require('./congress')
  , cache = require('./cache');

bot.use(tc, congress, cache);
