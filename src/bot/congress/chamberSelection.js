const {filter, upperFirst} = require('lodash')
  , congress = require('./../../congress');

module.exports = recentBillType => ({
  text: 'Select a chamber',
  reply_markup: {
    inline_keyboard: [
      congress.chambers.map(chamber => ({
        text: upperFirst(chamber),
        callback_data: filter(['congress', 'bills', chamber, recentBillType]).join('|')
      }))
    ]
  }
});
