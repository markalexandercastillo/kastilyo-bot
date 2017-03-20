const {filter, upperFirst, chunk} = require('lodash')
  , congress = require('./../../congress');

module.exports = chamber => ({
  text: 'Select a type of recent bill',
  reply_markup: {
    inline_keyboard: chunk(
      congress.bills.recentTypes.map(recentBillType => ({
        text: upperFirst(recentBillType),
        callback_data: filter(['congress', 'bills', chamber, recentBillType]).join('|')
      })),
      2
    )
  }
});
