const { registerAgent } = require('../api');
const helpers = require('../utils/heleprs');

const bsControllers = {
  async registerAgent() {
    try {
      const config = helpers.getConfig();
      const url = `${config.serverHost}:${config.serverPort}/notify-agent`;
      // ?? может можно как-то красивее, чем тупо localhost прописывать
      const params = {
        host: 'http://localhost',
        port: config.port
      };
      console.log('Send query to build server: ', url, 'to register build-agent');
      const response = await registerAgent(url, params);
      console.log(response.data.message);
    } catch(err) {
      console.error('Can not register build agent because of error: ', err.message);
    }
  }
};

module.exports = bsControllers;
