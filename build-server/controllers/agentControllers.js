const { startBuild } = require('../apiAgent');

const agentControllers = {
  // Получения настроек текущего репозитория (repoName и buildCommand)
  async startBuild(url, params) {
    try {
      console.log('CRAB====')
      await startBuild(url, params);
    } catch(err) {
      console.error('Can not send build to build-agent');
    }
  },
};

module.exports = agentControllers;
