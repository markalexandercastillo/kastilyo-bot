const bot = require('./helpers/telegram');
const findRandomMeme = require('./findRandomMeme');
const toonCaps = require('toon-caps');

bot.onText(
  /\/(morbotron|frinkiac) (.+)/,
  ({message_id, chat}, [ignore, toonCapsKey, searchTerms]) =>
    findRandomMeme(toonCaps[toonCapsKey], searchTerms)
      .then(({meme, episode}) => bot.sendPhoto(chat.id, meme.imageUrl, {
        caption: episode.wikiLink,
        reply_to_message_id: message_id
      }))
);
