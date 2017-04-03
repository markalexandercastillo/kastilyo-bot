const _ = require('lodash')
  , resourceSelection = require('./resourceSelection')
  , chamberSelection = require('./chamberSelection')
  , recentBillTypeSelection = require('./recentBillTypeSelection')
  , recentBillSelection = require('./recentBillSelection')
  , congress = require('./../../congress');

function getBillsTextAndReplyMarkup({chamber = null, recentBillType = null, offset = 0} = {}) {
  if (!chamber) return Promise.resolve(chamberSelection(recentBillType));
  if (!recentBillType) return Promise.resolve(recentBillTypeSelection(chamber));
  if (chamber && recentBillType) return recentBillSelection(chamber, recentBillType, offset);
}

function resolveBillsArgs(args) {
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

function extend({callbackQuery$, command$, bot}) {
  const congressCommand$ = command$
    .map(data => _.assign(data, {
      subType: data.args[0],
      args: data.args.slice(1)
    }))
    .merge(callbackQuery$.map(event => {
      const [type, subType, ...args] = event.data.split('|');
      return _.assign(event, {
        type,
        subType,
        args
      });
    }))
    .filter(({type}) => type === 'congress');

  const baseCommand$ = congressCommand$
    .filter(({subType}) => !subType);

  const billsCommand$ = congressCommand$
    .filter(({subType}) => subType === 'bills');

  baseCommand$.onValue(
    ({message}) =>
      Promise.resolve(resourceSelection())
        .then(({text, reply_markup}) => bot.sendMessage(message.chat.id, text, {reply_markup}))
  );

  billsCommand$.onValue(({args, message, callback_query_id}) => {
    return getBillsTextAndReplyMarkup(resolveBillsArgs(args))
      .then(({text, reply_markup}) =>
        callback_query_id
          ? bot.editMessageText(text, {
            chat_id: message.chat.id,
            message_id: message.message_id,
            reply_markup
          })
          : bot.sendMessage(message.chat.id, text, {reply_markup})
      );
  });
}

module.exports = {
  extend
};
