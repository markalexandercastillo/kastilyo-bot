const resourceSelection = require('./resourceSelection');
const chamberSelection = require('./chamberSelection');
const recentBillTypeSelection = require('./recentBillTypeSelection');
const recentBillSelection = require('./recentBillSelection');
const congress = require('./../../congress');

function getBillsTextAndReplyMarkup({chamber = null, recentBillType = null, offset = 0} = {}) {
  if (!chamber) return Promise.resolve(chamberSelection(recentBillType));
  if (!recentBillType) return Promise.resolve(recentBillTypeSelection(chamber));
  if (chamber && recentBillType) return recentBillSelection(chamber, recentBillType, offset);
}

function resolveBillsCallbackQueryArgs(args) {
  let chamber, recentBillType;
  args.forEach(arg => {
    if (congress.chambers.indexOf(arg) > -1) chamber = arg;
    if (congress.bills.recentTypes.indexOf(arg) > -1) recentBillType = arg;
  });

  const offset = args[2] || 0;

  return {
    chamber,
    recentBillType,
    offset
  };
}

function extend(bot) {
  bot.onText(
    /\/congress$/,
    message => Promise.resolve(resourceSelection()).then(
      ({text, reply_markup}) => bot.sendMessage(message.chat.id, text, {reply_markup})
    )
  );

  bot.onText(
    /\/congress bills$/,
    message => getBillsTextAndReplyMarkup().then(
      ({text, reply_markup}) => bot.sendMessage(message.chat.id, text, {reply_markup})
    )
  );

  bot.onText(
    /\/congress bills (introduced|major|updated|passed)$/,
    (message, [ignore, recentBillType]) => getBillsTextAndReplyMarkup({recentBillType}).then(
      ({text, reply_markup}) => bot.sendMessage(message.chat.id, text, {reply_markup})
    )
  );

  bot.onText(
    /\/congress bills (senate|house)$/,
    (message, [ignore, chamber]) => getBillsTextAndReplyMarkup({chamber}).then(
      ({text, reply_markup}) => bot.sendMessage(message.chat.id, text, {reply_markup})
    )
  );

  bot.onText(
    /\/congress bills (introduced|major|updated|passed) (senate|house)( \d+)*$/,
    (message, [ignore, recentBillType, chamber, offset = 0]) =>
      getBillsTextAndReplyMarkup({chamber, recentBillType, offset}).then(
        ({text, reply_markup}) => bot.sendMessage(message.chat.id, text, {reply_markup})
      )
  );

  bot.onText(
    /\/congress bills (senate|house) (introduced|major|updated|passed)( \d+)*$/,
    (message, [ignore, chamber, recentBillType, offset = 0]) =>
      getBillsTextAndReplyMarkup({chamber, recentBillType, offset}).then(
        ({text, reply_markup}) => bot.sendMessage(message.chat.id, text, {reply_markup})
      )
  );

  bot.on('callback_query', ({message, data}) => {
    const [type, resource, ...args] = data.split('|');
    if (type === 'congress' && resource === 'bills') {
      getBillsTextAndReplyMarkup(resolveBillsCallbackQueryArgs(args))
        .then(({text, reply_markup}) =>
          bot.editMessageText(text, {
            chat_id: message.chat.id,
            message_id: message.message_id,
            reply_markup
          })
        );
    }
  });
}

module.exports = {
  extend
};
