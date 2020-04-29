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
    try {
      await axios.post(`${serverUrl}/notify-agent`, agentParams);
      console.log('Successfully register build agent');
      return true;
    } catch (err) {
      console.error(`Can't register build agent because of error: ${err.message}`);
      return false;
    }
  },

  async sendBuildResults(params) {
    try {
      await axios.post(`${serverUrl}/notify-build-result`, params);
      console.log(`Successfully send result to build server`);
      return true;
    } catch (err) {
      console.error(`Can't send result to build server because of error: ${err.message}`);
      return false;
    }
  },
};

module.exports = apiBS;
