const agentControllers = {
  async startBuild(req, res) {
    const message = `Build agent successfully got the build ${req.body.buildId}`;
    console.log(message);
    res.status(200).json({
      message: message
    })
    // Склонировать репозиторий
    // перейти к нужному коммиту
    // Запустить команду
  //   try {
  //     const config = helpers.getConfig();
  //     const url = `${config.serverHost}:${config.serverPort}/notify-agent`;
  //     // ?? может можно как-то красивее, чем тупо localhost прописывать
  //     const params = {
  //       host: 'http://localhost',
  //       port: config.port
  //     };
  //     const response = await registerAgent(url, params);
  //     console.log(response.data.message);
  //   } catch(err) {
  //     console.error('Can not register build agent because of error: ', err.message);
  //   }
  }
};

module.exports = agentControllers;
