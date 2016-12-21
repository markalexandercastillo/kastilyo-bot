const bot = require('./helpers/telegram');
const findRandomMeme = require('./findRandomMeme');
const toonCaps = require('toon-caps');

bot.onText(
  /\/(morbotron|frinkiac) (.+)/,
  ({chat}, [ignore, toonCapsKey, searchTerms]) =>
    findRandomMeme(toonCaps[toonCapsKey], searchTerms)
      .then(({meme}) => bot.sendPhoto(chat.id, meme.imageUrl))
);
