module.exports = (text, bills, ...additionalRows) => ({
  text,
  reply_markup: {
    inline_keyboard: [
      ...bills.map(({number, title}) => [{
        text: `${number} - ${title}`,
        callback_data: ['congress', 'bill', number].join('|')
      }]),
      ...additionalRows
    ]
  }
});
