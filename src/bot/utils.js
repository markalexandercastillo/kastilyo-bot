const button = (text, callbackData)  => ({ text, callback_data: callbackData.join('|')});

const inlineKeyboard = (...rows) => ({
  inline_keyboard: rows
});

module.exports = {
  button,
  inlineKeyboard
};
