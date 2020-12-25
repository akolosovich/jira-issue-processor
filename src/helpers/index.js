const { epics } = require('../../config');
const { enumCategory } = require('../dtos/enums');

/**
 * @param {String} text
 * @returns {String}
 */
const urlify = text => {
  if (!text) {
    return null;
  }

  const data = text.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);

  if (data && data.length) {
    return `https://${data[0]}`;
  }

  return null;
};

/**
 * @param {String} link
 * @returns {String}
 */
const getCategoryByLink = link => {
  if (!link) {
    return null;
  }

  if (link.startsWith('https://www.metacritic.com')) {
    return enumCategory.METACRITIC;
  }

  if (link.startsWith('https://www.imdb.com')) {
    return enumCategory.IMDB;
  }

  return null;
};

/**
 * @param {String} category
 * @returns {String}
 */
const getEpicByCategory = category => {
  switch (category) {
    case enumCategory.METACRITIC:
    case enumCategory.IMDB:
      return epics.watching;
    default:
      return null;
  }
};

module.exports = {
  urlify,
  getCategoryByLink,
  getEpicByCategory,
};
