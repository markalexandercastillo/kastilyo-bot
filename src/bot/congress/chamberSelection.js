const {filter, upperFirst} = require('lodash')
  , {inlineKeyboard, button} = require('./../utils')
  , chambers = require('./chambers');

module.exports = recentBillType => [
  'Select a chamber',
  inlineKeyboard([...chambers.map(
    chamber => button(
      upperFirst(chamber),
      filter(['congress', 'bills', chamber, recentBillType])
    )
  )])
];
