const chamberSelection = require('./chamberSelection');
const recentBillTypeSelection = require('./recentBillTypeSelection');
const recentBillSelection = require('./recentBillSelection');
const chambers = require('./chambers');
const recentBillTypes = require('./recentBillTypes');

function getBillsTextAndReplyMarkup({chamber = null, recentBillType = null, offset = 0} = {}) {
  if (!chamber) return Promise.resolve(chamberSelection(recentBillType));
  if (!recentBillType) return Promise.resolve(recentBillTypeSelection(chamber));
  if (chamber && recentBillType) return recentBillSelection(chamber, recentBillType, offset);
}

function extend(bot) {
  bot.onText(
    /\/congress bills$/,
    message => {
      const [text, reply_markup] = chamberSelection();
      bot.sendMessage(message.chat.id, text, {reply_markup});
    }
  );

  bot.onText(
    /\/congress bills (introduced|major|updated|passed)$/,
    (message, [ignore, recentBillType]) => {
      const [text, reply_markup] = chamberSelection(recentBillType);
      bot.sendMessage(message.chat.id, text, {reply_markup});
    }
  );

  bot.onText(
    /\/congress bills (senate|house)$/,
    (message, [ignore, chamber]) => {
      const [text, reply_markup] = recentBillTypeSelection(chamber);
      bot.sendMessage(message.chat.id, text, {reply_markup});
    }
  );

  bot.onText(
    /\/congress bills (introduced|major|updated|passed) (senate|house)( \d+)*$/,
    (message, [ignore, recentBillType, chamber, offset = 0]) =>
      recentBillSelection(chamber, recentBillType, parseInt(offset))
        .then(([text, reply_markup]) =>
          bot.sendMessage(message.chat.id, text, {reply_markup})
        )
  );

  bot.onText(
    /\/congress bills (senate|house) (introduced|major|updated|passed)( \d+)*$/,
    (message, [ignore, chamber, recentBillType, offset = 0]) =>
      recentBillSelection(chamber, recentBillType, parseInt(offset))
        .then(([text, reply_markup]) =>
          bot.sendMessage(message.chat.id, text, {reply_markup})
        )
  );

  bot.on('callback_query', ({message, data}) => {
    data = data.split('|');
    const [type, resource, ...args] = data;
    if (type === 'congress' && resource === 'bills' && args.length) {
      let chamber, recentBillType;

      args.forEach(arg => {
        if (chambers.contains(arg)) chamber = arg;
        if (recentBillTypes.contains(arg)) recentBillType = arg;
      });
      const offset = args[2] || 0;

      const gettingTextAndReplyMarkup = getBillsTextAndReplyMarkup({chamber, recentBillType, offset});

      gettingTextAndReplyMarkup
        .then(([text, reply_markup]) =>
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
