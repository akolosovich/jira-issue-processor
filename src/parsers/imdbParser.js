const { snakeCase } = require('lodash/fp');

const { AbstractParser } = require('./abstractParser');

class ImdbParser extends AbstractParser {
  /**
   * @param {String} link
   * @param {String} pageContent
   * @returns {*}
   */
  parse(link, pageContent) {
    this.logger.info(`Parsing content for Link ${link}`);

    const $ = this.cheerio.load(pageContent);

    const title = $('h1')
      .text()
      .trim();
    const director = $('.credit_summary_item a')
      .first()
      .text()
      .trim();
    const directorLabel = snakeCase(director);
    const runtime = $('time')
      .first()
      .text()
      .trim()
      .replace('min', 'm');
    const date = $('.release_date span')
      .text()
      .trim();

    const summary = `${director} - ${title}`;
    const description = $('#titleStoryLine div p span')
      .first()
      .text()
      .trim();

    return {
      date,
      runtime,
      summary,
      description: `${link}\n${date}\n\n${description}`,
      labels: [this.type, directorLabel],
    };
  }
}

module.exports = {
  ImdbParser,
};
