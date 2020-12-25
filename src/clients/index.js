const axios = require('axios');

const getUrl = url =>
  axios({
    url,
    method: 'GET',
    headers: {
      'content-language': 'en-GB',
      'Accept-Language': 'en-GB,en;q=0.5',
    },
  });

module.exports = {
  getUrl,
};
