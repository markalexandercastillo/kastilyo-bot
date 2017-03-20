const tc = require('./../toon-caps');

function extend({command$, pushSendPhoto, pushSendMessage}) {
  const tcCommand$ = command$
    .filter(({type, query}) => (type === 'morbotron' || type === 'frinkiac') && query);

  tcCommand$.onValue(
    ({type, query, message}) =>
        tc[type].findRandomMeme(query)
          .then(({meme, episode}) => pushSendPhoto(message.chat.id, meme.imageUrl, {
            caption: episode.wikiLink,
            reply_to_message_id: message.message_id
          }))
          .catch(() => pushSendMessage(
            message.chat.id,
            "Couldn't find anything",
            {reply_to_message_id: message.message_id}
          ))
  );
}

module.exports = {
  extend
};
