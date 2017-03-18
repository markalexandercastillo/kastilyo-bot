const {filter, upperFirst, chunk} = require('lodash')
  , {inlineKeyboard, button} = require('./../utils')
  , recentBillTypes = require('./recentBillTypes');

module.exports = chamber => [
  'Select a type of recent bill',
  inlineKeyboard(...chunk(
    recentBillTypes.map(recentBillType => button(
      upperFirst(recentBillType), filter(['congress', 'bills', chamber, recentBillType])
    )),
    2
  ))
];
