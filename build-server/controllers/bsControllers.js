const storage = require('../storage');

const bsControllers = {
  // Получения настроек текущего репозитория (repoName и buildCommand)
  async registerAgent(req, res) {
    const message = storage.registerAgent(req.body)
      ? 'Build agent successfully registered'
      : 'Can not register build agent with such url. It already exists';
    // ?? Возможно, если агент уже зареган - лучше выдавать 500, или хотя бы спец, статус в json добавлять
    res.status(200).json({
      message:  message
    })
  },

  // Получения списка сборок
  async getBuildResult(req, res) {
    let { buildId, status, log } = req.body;

    console.log(`Result of build ${buildId} successfully got with status ${status}`);
    res.status(200).json({
      message: 'Result of build successfully got'
    });

    storage.updateAgentStatus(buildId, true); // в любом случае освобождаем агент
    status = status ? 'Success' : 'Fail';
    storage.updateBuildStatus(buildId, status);
    //saveToStorage
    storage.deleteBuild(buildId);
  },
};

module.exports = bsControllers;
