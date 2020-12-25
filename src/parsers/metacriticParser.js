const { AbstractParser } = require('./abstractParser');

class MetacriticParser extends AbstractParser {
  /**
   * @param {String} link
   * @param {String} pageContent
   * @returns {*}
   */
  parse(link, pageContent) {
    this.logger.info(`Parsing content for Link ${link}`);

    const $ = this.cheerio.load(pageContent);

    const director = $('.director a').text();
    const runtime = $('.runtime span')
      .text()
      .replace('Runtime:', '');
    const date = $('.release_date span').text();
    const summary = `${director} - ${$('h1').text()}`;
    const description = `${link}\n${runtime}\n${date}\n\n${$('.summary_deck .blurb_expanded').text()}`;

    return {
      date,
      runtime,
      summary,
      description,
      labels: [this.type, director],
    };
  }
}

module.exports = {
  MetacriticParser,
};
