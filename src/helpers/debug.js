const debug = require('debug');

module.exports = function(...namespaces) {
  return debug(['kastilyo-bot'].concat(namespaces).join(':'));
};
