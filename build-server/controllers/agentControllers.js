const { startBuild } = require('../apiAgent');

const agentControllers = {
  // Обработка отправки билда билд агенту
  async startBuild(url, params) {
    try {
      console.log('Try to send build', params.buildId, 'to build-agent: ', url);
      const response = await startBuild(url, params);
      console.log(response.data.message);
    } catch(err) {
      console.log('Can not send', params.buildId, 'to build-agent ', url, 'because of error: ', err.message);
    }
  },
};

module.exports = agentControllers;
