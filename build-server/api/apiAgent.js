const axios = require('axios').default;

const apiAgent = {
  // Получения списка сборок
  async startBuild(url, params) {
    return await axios.post(url, params);
  },

  // async checkIsAgentReachable(url) {
  //   return await axios.get(url);
  // },
};

module.exports = apiAgent;
