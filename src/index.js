const bot = require('./helpers/telegram');
const findRandomMeme = require('./findRandomMeme');
const {morbotron, frinkiac} = require('toon-caps');

bot.onText(
  /\/morbotron (.+)/,
  (message, [ignore, searchTerms]) =>
    findRandomMeme(morbotron, searchTerms)
      .then(memeImageUrl => bot.sendPhoto(message.chat.id, memeImageUrl))
);


bot.onText(
  /\/frinkiac (.+)/,
  (message, [ignore, searchTerms]) =>
    findRandomMeme(frinkiac, searchTerms)
      .then(memeImageUrl => bot.sendPhoto(message.chat.id, memeImageUrl))
);
