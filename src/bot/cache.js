const cache = require('./../cache');

function extend({command$, pushSendMessage}) {
  const cacheCommand$ = command$
    .filter(({type}) => type === 'cache');

  const flushCacheCommand$ = cacheCommand$
    .filter(({subType}) => subType === 'flush');

  flushCacheCommand$.onValue(
    ({message}) => cache.flushAll()
      .then(() => pushSendMessage(message.chat.id, 'Cache has been flushed'))
  );
}

module.exports = {
  extend
};
