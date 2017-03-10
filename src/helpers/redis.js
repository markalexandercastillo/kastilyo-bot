/**
 * Exports a configured promisified redis client instance
 */

const redis = require('redis')
  , Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

module.exports = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
