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
  async getBuildResult({ buildId, status, log}, res) {
    // storage.setAgentStatus(buildId, 'free');
    //
    // // Поменять статус агента на свободен
    // // дернуть ручку finish (изменить статус билда)
    // res.status(200).json({
    //   message: 'Result of build successfully got'
    // })
  },
};

module.exports = bsControllers;
