const https = require('https');
const axios = require('axios').default;
const helpers = require('../utils/helpers');

const apiAgent = {
  // Получения списка сборок
  async startBuild(url, params) {
    return await axios.post(url, params);
  },
};

module.exports = apiAgent;
