const { apiAgent } = require('../api');

const controllersAgent = {
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

  // async checkIsAgentReachable(url) {
  //   try {
  //     await apiAgent.checkIsAgentReachable(url);
  //     return true;
  //   } catch(err) {
  //     return false;
  //   }
  // }
};

module.exports = controllersAgent;
