const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_TOKEN;
const options = {
  polling: true
};
module.exports = new TelegramBot(token, options);
