const axios = require('axios').default;

const apiAgent = {
  // Получения списка сборок
  async startBuild(url, params) {
    return await axios.post(url, params);
  },
};

module.exports = apiAgent;
