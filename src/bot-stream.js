const {fromBinder, Bus} = require('baconjs')
  , {find, assign} = require('lodash')
  , telegram = require('./helpers/telegram');

const text$ = fromBinder(sink => telegram.onText(/(.*)/, sink));
const callbackQuery$ = fromBinder(sink => telegram.on('callback_query', sink))
  .map(({id, message, data}) => {
    const [type, subType, ...args] = data.split('|');
    return {
      callbackQueryId: id,
      message,
      type,
      subType,
      args
    };
  });

const command$ = text$
  .filter(({entities = []}) => find(entities, {type: 'bot_command', offset: 0}))
  .map(message => {
    const commandEntity = find(message.entities, {type: 'bot_command'});
    return {
      message,
      type: message.text.slice(1, commandEntity.length),
      query: message.text.slice(commandEntity.length + 1)
    };
  });

const cliCommand$ = command$
  .map(command => {
    const [subType, ...args] = command.query.split(' ');
    return assign(command, {subType, args});
  });

const sendMessageBus = new Bus();
const editMessageTextBus = new Bus();
const sendPhotoBus = new Bus();

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

function pushSendPhoto(chatId, photo, options = {}) {
  sendPhotoBus.push({chatId, photo, options});
}

sendPhotoBus
  .onValue(({chatId, photo, options}) => telegram.sendPhoto(chatId, photo, options));

module.exports = {
  text$,
  callbackQuery$,
  cliCommand$,
  command$,
  pushSendMessage,
  pushEditMessageText,
  pushSendPhoto,
  use(...modules) {
    modules.forEach(({extend}) => extend(this));
  }
};
