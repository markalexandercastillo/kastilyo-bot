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

function extend({callbackQuery$, command$, pushSendMessage, pushEditMessageText}) {
  const congressCommand$ = command$
    .merge(callbackQuery$)
    .filter(({type}) => type === 'congress');

  const baseCommand$ = congressCommand$
    .filter(({subType}) => !subType);

  const billsCommand$ = congressCommand$
    .filter(({subType}) => subType === 'bills');

  baseCommand$.onValue(
    ({message}) =>
      Promise.resolve(resourceSelection())
        .then(({text, reply_markup}) => pushSendMessage(message.chat.id, text, {reply_markup}))
  );

  billsCommand$.onValue(({args, message, callbackQueryId}) => {
    getBillsTextAndReplyMarkup(resolveBillsArgs(args))
      .then(({text, reply_markup}) => {
        callbackQueryId
          ? pushEditMessageText(text, {
            chat_id: message.chat.id,
            message_id: message.message_id,
            reply_markup
          })
          : pushSendMessage(message.chat.id, text, {reply_markup});
      });
  });
}

module.exports = {
  extend
};
