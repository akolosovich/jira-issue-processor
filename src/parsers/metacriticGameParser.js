const snakeCase = require('lodash/fp/snakeCase');

const { AbstractParser } = require('./abstractParser');

class MetacriticGameParser extends AbstractParser {
  /**
   * @param {String} link
   * @param {String} pageContent
   * @returns {*}
   */
  parse(link, pageContent) {
    this.logger.info(`Parsing content for Link ${link}`);

    const $ = this.cheerio.load(pageContent);

    const developer = $('.summary_detail.developer .data')
      .text()
      .trim();

    const date = $('.release_date span').text();
    const title = $('h1').text();
    const summary = `${title} - ${developer}`;
    const description = `${link}\n\n${date}\n\n${$('.summary_detail.product_summary .data')
      .text()
      .trim()}`;

    return {
      date,
      summary,
      description,
      labels: [this.type, snakeCase(developer)],
    };
  }
}

module.exports = {
  MetacriticGameParser,
};
