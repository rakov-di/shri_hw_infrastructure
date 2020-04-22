const axios = require('axios').default;
const helpers = require('../utils/heleprs');

const config = helpers.getConfig();
const serverUrl = `${config.serverHost}:${config.serverPort}`;
// ?? может можно как-то красивее, чем тупо localhost прописывать
const agentParams = {
  host: 'http://localhost',
  port: config.port
};

const apiBS = {
  // Зарегистрировать билд-агент на билд-сервере
  async registerAgent() {
    return await axios.post(`${serverUrl}/notify-agent`, agentParams);
  },

  async sendBuildResults(params) {
    return await axios.post(`${serverUrl}/notify-build-result`, params);
  },
};

module.exports = apiBS;
