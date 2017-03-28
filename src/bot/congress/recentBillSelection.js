const {slice, filter} = require('lodash')
  , congress = require('./../../congress')
  , billSelection = require('./billSelection');

const previousBillsButton =
  (chamber, recentBillType, currentOffset) =>
    currentOffset
      ? {
        text: 'See previous bills',
        callback_data: ['congress', 'bills', chamber, recentBillType, currentOffset - 5].join('|')
      }
      : null;

const moreBillsButton =
  (chamber, recentBillType, currentOffset) =>
    currentOffset !== 15
      ? {
        text: 'See more bills',
        callback_data: ['congress', 'bills', chamber, recentBillType, currentOffset + 5].join('|')
      }
      : null;

const paginationButtons =
  (chamber, recentBillType, currentOffset) =>
    filter([
      previousBillsButton(chamber, recentBillType, currentOffset),
      moreBillsButton(chamber, recentBillType, currentOffset)
    ]);

module.exports = async function (chamber, recentBillType, offset) {
  offset = offset ? parseInt(offset) : 0;
  const apiOffset = Math.floor(offset / 20) * 20;
  const bills = slice(
    await congress.bills.getRecent(chamber, recentBillType, apiOffset),
    offset,
    offset + 5
  );

  return billSelection(
    `Recent ${recentBillType} bills`,
    bills,
    paginationButtons(chamber, recentBillType, offset)
  );
};
