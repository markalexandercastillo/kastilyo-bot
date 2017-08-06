const tc = require('./../toon-caps');

function extend({command$, bot}) {
  const tcCommand$ = command$
    .filter(({type, args}) =>
      (
        type === 'morbotron'
        || type === 'frinkiac'
        || type === 'infinite_rick'
      ) && args.length);

  const resolveClient = type => tc[type === 'infinite_rick' ? 'masterOfAllScience' : type];

  tcCommand$.onValue(
    ({type, args, message}) =>
        resolveClient(type).findRandomMeme(args.join(' '))
          .then(({meme, episode}) => bot.sendPhoto(message.chat.id, meme.imageUrl, {
            caption: episode.wikiLink,
            reply_to_message_id: message.message_id
          }))
          .catch(() => bot.sendMessage(
            message.chat.id,
            "Couldn't find anything",
            {reply_to_message_id: message.message_id}
          ))
  );
}

module.exports = {
  extend
};
