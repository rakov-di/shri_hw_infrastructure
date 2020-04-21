const { cloneRepo, makeBuild } = require('../utils/git');
const bsControllers = require('./bsController');

const agentControllers = {
  async startBuild(req, res) {
    const message = `Build agent successfully got the build ${req.body.buildId}`;
    console.log(message);
    res.status(200).json({
      message: message
    });
    const { buildId, repoName, buildCommand, commitHash } = req.body;

    try {
      await cloneRepo(repoName);
      const result = await makeBuild(repoName, commitHash, buildCommand);
      console.log('crab', buildId, repoName);
      await bsControllers.sendBuildResults({ buildId, status: true, log: `${result.stderr}\n\n${result.stdout}` });
    } catch(err) {
      await bsControllers.sendBuildResults({ buildId, status: false, log: err.message });
      console.error(`Can't make builed because of error${err.message}`);
    }
  }
};

module.exports = agentControllers;
