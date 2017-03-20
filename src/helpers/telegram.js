const TelegramBot = require('node-telegram-bot-api');
const {getPrototypeOf, assign, create} = Object;
const token = process.env.TELEGRAM_BOT_TOKEN;
const options = {
  polling: true
};
const telegramBot = new TelegramBot(token, options);
module.exports = assign(create(getPrototypeOf(telegramBot)), telegramBot);
