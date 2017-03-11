/**
 * Exports a method for extending a tooncaps client for finding memes based on the
 * given search terms
 */
const _ = require('lodash');


/**
 * Extracts subtitle content from the given captions based on the screenshot
 * @param  {Object} screenshot
 * @param  {Object} captions
 * @return {String}
 */
function getMemeText(screenshot, captions) {
  return captions.subtitles
    // target the subtitle(s) that show up for this timestamp
    .filter(({startTimestamp, endTimestamp}) => (screenshot.timestamp >= startTimestamp && screenshot.timestamp <= endTimestamp))
    .map(({content}) => content)
    // make into one long string
    .join(' ');
}

/**
 * Resolves to an object with some data about an episode and a meme which
 * should match the given search terms
 * @param  {String} searchTerms
 * @return {Promise}
 */
function findRandomMeme(searchTerms) {
  // find screenshots based on the given search terms
  return this.searchScreenshots(searchTerms)
    // pick a random one from the result
    .then(_.sample)
    // find captions for the given screenshot
    .then(screenshot => this.getCaptions(screenshot)
      .then(captions => {
        // determine text to use for meme
        const memeText = getMemeText(screenshot, captions);
        // construct meme url
        return {
          episode: captions.episode,
          screenshot,
          captions,
          meme: {
            text: memeText,
            imageUrl: this.getMemeUrl(screenshot, memeText)
          }
        };
      })
    );
}

module.exports = findRandomMeme;