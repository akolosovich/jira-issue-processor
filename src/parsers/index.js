const cheerio = require('cheerio');

const loggerFactory = require('../logger');
const { ParserFactory } = require('./parserFactory');

const parserFactory = new ParserFactory(cheerio, loggerFactory);

module.exports = {
  parserFactory,
};
