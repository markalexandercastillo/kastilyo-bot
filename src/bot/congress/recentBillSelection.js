const {slice, filter} = require('lodash')
  , congress = require('./../../congress')
  , {button} = require('./../utils')
  , billSelection = require('./billSelection');

const navButtons = (chamber, recentBillType, offset) => {
  const [nextOffset, prevOffset] = [offset + 5, offset - 5];
  const nextButton = nextOffset < 20
    ? button('See more bills', ['congress', 'bills', chamber, recentBillType, nextOffset])
    : null;
  const prevButton = prevOffset >= 0
    ? button('See previous bills', ['congress', 'bills', chamber, recentBillType, prevOffset])
    : null;
  return filter([prevButton, nextButton]);
};

module.exports = (chamber, recentBillType, offset) => {
  offset = parseInt(offset || 0);
  const apiOffset = Math.floor(offset/20) * 20;
  return congress.bills.getRecent(chamber, recentBillType, apiOffset)
    .then(bills => slice(bills, offset, offset + 5))
    .then(bills => billSelection(
      `Recent ${recentBillType} bills`,
      bills,
      navButtons(chamber, recentBillType, offset)
    ));
};
