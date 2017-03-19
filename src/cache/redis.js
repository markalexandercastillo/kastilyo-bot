const redis = require('./../helpers/redis');

module.exports = {
  hgetall: (...args) => redis.hgetallAsync(...args),
  hmset: (...args) => redis.hmsetAsync(...args),
  hset: (...args) => redis.hsetAsync(...args),
  hget: (...args) => redis.hgetAsync(...args),
  lrange: (...args) => redis.lrangeAsync(...args),
  rpush: (...args) => redis.rpushAsync(...args),
  smembers: (...args) => redis.smembersAsync(...args),
  sadd: (...args) => redis.saddAsync(...args),
  flushall: (...args) => redis.flushallAsync(...args)
};
