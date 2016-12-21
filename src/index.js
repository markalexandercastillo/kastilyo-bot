const dotenv = require('dotenv');
const _ = require('lodash');
dotenv.load({ silent: true });
const {morbotron, frinkiac} = require('toon-caps');
const Rx = require('rxjs');
const bot = require('./helpers/telegram');

const morbotron$ = Rx.Observable.create(observer => {
  bot.onText(/\/morbotron (.+)/, (message, [ignore, searchTerms]) => {
    observer.next({message, searchTerms});
  });
});

const frinkiac$ = Rx.Observable.create(observer => {
  bot.onText(/\/frinkiac (.+)/, (message, [ignore, searchTerms]) => {
    observer.next({message, searchTerms});
  });
});

morbotron$.subscribe(({message, searchTerms}) => {
  function sendMeme(message, screenshot, captions) {
    const memeText = captions.subtitles
      // target the subtitle(s) that show up for this timestamp
      .filter(({startTimestamp, endTimestamp}) => (screenshot.timestamp >= startTimestamp && screenshot.timestamp <= endTimestamp))
      // pluck text
      .map(({content}) => content)
      // make into one long string
      .join(' ');

    bot.sendPhoto(message.chat.id, morbotron.getMemeUrl(screenshot, memeText));
  }

  morbotron.searchScreenshots(searchTerms)
    .then(_.sample)
    // merge it with its captions
    .then(screenshot => morbotron.getCaptions(screenshot).then(captions => ({screenshot, captions})))
    .then(({screenshot, captions}) => sendMeme(message, screenshot, captions))
    ;
});

frinkiac$.subscribe(({message, searchTerms}) => {
  function sendMeme(message, screenshot, captions) {
    const memeText = captions.subtitles
      // target the subtitle(s) that show up for this timestamp
      .filter(({startTimestamp, endTimestamp}) => (screenshot.timestamp >= startTimestamp && screenshot.timestamp <= endTimestamp))
      .map(({content}) => content)
      // make into one long string
      .join(' ');

    bot.sendPhoto(message.chat.id, frinkiac.getMemeUrl(screenshot, memeText));
  }

  frinkiac.searchScreenshots(searchTerms)
    .then(_.sample)
    // merge it with its captions
    .then(screenshot => frinkiac.getCaptions(screenshot).then(captions => ({screenshot, captions})))
    .then(({screenshot, captions}) => sendMeme(message, screenshot, captions))
    ;
});
