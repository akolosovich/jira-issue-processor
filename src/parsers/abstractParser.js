class AbstractParser {
  /**
   * @param {String} type
   * @param {*} cheerio
   * @param {*} logger
   */
  constructor(type, cheerio, logger) {
    this.type = type;
    this.cheerio = cheerio;
    this.logger = logger;
  }

  /**
   * @param {String} link
   * @param {*} pageContent
   */
  parse(link, pageContent) {
    throw new Error('Not implemented');
  }
}

module.exports = {
  AbstractParser,
};
