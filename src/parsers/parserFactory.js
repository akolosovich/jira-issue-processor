const { MetacriticParser } = require('./metacriticParser');
const { ImdbParser } = require('./imdbParser');
const { enumCategory } = require('../dtos/enums');

class ParserFactory {
  constructor(cheerio, loggerFactory) {
    this.cheerio = cheerio;
    this.loggerFactory = loggerFactory;
    this.storage = {};
  }

  /**
   * @param {String} type
   * @returns {*}
   */
  createByType(type) {
    if (this.storage[type]) {
      return this.storage[type];
    }

    if (type === enumCategory.METACRITIC) {
      this.storage[type] = new MetacriticParser(type, this.cheerio, this.loggerFactory.getLogger('MetacriticParser'));
    }

    if (type === enumCategory.IMDB) {
      this.storage[type] = new ImdbParser(type, this.cheerio, this.loggerFactory.getLogger('ImdbParser'));
    }

    return this.storage[type];
  }
}

module.exports = {
  ParserFactory,
};
