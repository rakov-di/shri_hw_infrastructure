const { registerAgent, sendBuildResults } = require('../api');

const bsControllers = {
  async registerAgent() {
    try {
      const response = await registerAgent();
      console.log(response.data.message);
    } catch(err) {
      console.error('Can not register build agent because of error: ', err.message);
    }
  },

  async sendBuildResults(params) {
    try {
      const response = await sendBuildResults(params);
      console.log(response.data.message);
    } catch(err) {
      console.error('Can not send result ti build server because of error: ', err.message);
    }
  }
};

module.exports = bsControllers;
