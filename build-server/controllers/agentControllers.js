const { apiAgent } = require('../api');

const agentControllers = {
  // Обработка отправки билда билд агенту
  async startBuild(url, params) {
    try {
      console.log('Try to send build', params.buildId, 'to build-agent: ', url);
      await apiAgent.startBuild(url, params);
      return true;
    } catch(err) {
      console.log('Can not send', params.buildId, 'to build-agent ', url, 'because of error: ', err.message);
      return false;
    }
  },
};

module.exports = agentControllers;
