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
      console.log(buildId, result.stdout);
      await bsControllers.sendBuildResults({ buildId, status: 'success', log: result.stdout });
    } catch(err) {
      console.error(err);
    }
  }
};

module.exports = agentControllers;
