/**
 * Exports a method for extending a tooncaps client for finding memes based on the
 * given search terms
 */
const {sample} = require('lodash');


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
async function findRandomMeme(searchTerms) {
   // pick a random one screenshot from the search results
  const screenshot = sample(await this.searchScreenshots(searchTerms));
  // find captions for the random screenshot
  const captions = await this.getCaptions(screenshot);
  // determine text to use for meme
  const memeText = getMemeText(screenshot, captions);
  // find screenshots based on the given search terms
  return {
    episode: captions.episode,
    screenshot,
    captions,
    meme: {
      text: memeText,
      imageUrl: this.getMemeUrl(screenshot, memeText)
    }
  };
}

module.exports = findRandomMeme;
