// const apiAgent = require('../apiAgent');
const apiDB = require('../apiDB');
const controllers = require('../controllers');

class Storage{
  constructor() {
    this.buildsList = [];
    this.buildAgents = [];
    this.buildAgentsAll = [];
    this.buildAgentsFree = [];
    this.interval = 5000; // интервал повторения для поиска свободных билд-агентов
  }

  updateSettings(settings) {
    this.settings = settings;
  }

  updateBuildsList(newBuildsList) {
    this.buildsList = newBuildsList.filter(build => build.status === 'Waiting').map(build => build.id);
    this.searchAgent();
  }

  searchAgent() {
    const freeAgents = this.buildAgents.filter(agent => agent.status === 'free');
    if (freeAgents.length) {
      console.log('There are free build-agents');
      this.assignBuildToAgent(`${freeAgents[0].host}:${freeAgents[0].port}`);
    } else {
      console.log('There is no free build-agents');
      setTimeout(this.searchAgent.bind(this), this.interval);
    }
  }

  async assignBuildToAgent(agentURL) {
    // const builds = this.buildAgents.filter(build => build.status === 'Waiting');
    // const build = builds[builds.length - 1]; // берем первый из ожидающих билда коммитов (наиболее старый)
    // const repoSettings = await controllers.getSettings();
    const params = {
      // buildId: build.id,
      // commitHash: build.commitHash,
      repoName: repoSettings.repoName,
      buildCommand:repoSettings.buildCommand
    };
    console.log('Build was send to build-agent: ', agentURL, ' with paramd: ', params);
    // apiAgent.startBuild(agentURL, params);
  }
}

module.exports = new Storage();
