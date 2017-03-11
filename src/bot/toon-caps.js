const tc = require('./../toon-caps');

const findRandomMeme =
  (bot, {message_id, chat}, [ignore, toonCapsKey, searchTerms]) =>
    tc[toonCapsKey].findRandomMeme(searchTerms)
      .then(({meme, episode}) => bot.sendPhoto(chat.id, meme.imageUrl, {
        caption: episode.wikiLink,
        reply_to_message_id: message_id
      }));

function extend(bot) {
  bot.onText(
    /\/(morbotron|frinkiac) (.+)/,
    (message, matches) => findRandomMeme(bot, message, matches)
  );
}

module.exports = {
  extend
};
