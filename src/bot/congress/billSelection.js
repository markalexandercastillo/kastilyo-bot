const {inlineKeyboard, button} = require('./../utils');

module.exports = (text, bills, ...additionalRows) => [
  text,
  inlineKeyboard(...bills.map(({number, title}) => [button(
    `${number} - ${title}`,
    ['congress', 'bill', number]
  )]).concat(additionalRows))
];
