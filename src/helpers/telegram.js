const TelegramBot = require('node-telegram-bot-api');
const TelegramBotEventStream = require('telegram-bot-event-stream');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});

module.exports = TelegramBotEventStream.create(bot);
