const { MetacriticMovieParser } = require('./metacriticMovieParser');
const { MetacriticGameParser } = require('./metacriticGameParser');
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

    if (type === enumCategory.METACRITIC_MOVIE) {
      this.storage[type] = new MetacriticMovieParser(
        type,
        this.cheerio,
        this.loggerFactory.getLogger('MetacriticMovieParser'),
      );
    }

    if (type === enumCategory.METACRITIC_GAME) {
      this.storage[type] = new MetacriticGameParser(
        type,
        this.cheerio,
        this.loggerFactory.getLogger('MetacriticGameParser'),
      );
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
