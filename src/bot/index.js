const bot = require('./../bot-stream')
  , tc = require('./toon-caps')
  , congress = require('./congress')
  , cache = require('./cache');

bot.use(tc, congress, cache);
