const {fromBinder, Bus} = require('baconjs')
  , {find} = require('lodash')
  , telegram = require('./helpers/telegram');

const text$ = fromBinder(sink => telegram.onText(/(.*)/, sink));
const callbackQuery$ = fromBinder(telegram.onCallbackQuery);
const command$ = text$
  .filter(({entities = []}) => find(entities, {type: 'bot_command', offset: 0}))
  .map(message => {
    const commandEntity = find(message.entities, {type: 'bot_command'});
    return {
      message,
      type: message.text.slice(1, commandEntity.length),
      argString: message.text.slice(commandEntity.length + 1)
    };
  });

const sendMessageBus = new Bus();
const editMessageTextBus = new Bus();

function pushSendMessage(chatId, text, options = {}) {
  sendMessageBus.push({chatId, text, options});
}

sendMessageBus
  .onValue(({chatId, text, options}) => telegram.sendMessage(chatId, text, options));

function pushEditMessageText(text, options) {
  editMessageTextBus.push({text, options});
}

editMessageTextBus
  .onValue(({text, options}) => telegram.editMessageText(text, options));

module.exports = {
  text$,
  callbackQuery$,
  command$,
  pushSendMessage,
  pushEditMessageText
};
