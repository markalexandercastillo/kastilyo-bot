const bot = require('./helpers/telegram');
const tc = require('./toon-caps');

bot.onText(
  /\/(morbotron|frinkiac) (.+)/,
  ({message_id, chat}, [ignore, toonCapsKey, searchTerms]) =>
      tc[toonCapsKey].findRandomMeme(searchTerms)
        .then(({meme, episode}) => bot.sendPhoto(chat.id, meme.imageUrl, {
          caption: episode.wikiLink,
          reply_to_message_id: message_id
        }))
);
