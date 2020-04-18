// const apiAgent = require('../apiAgent');
const apiDB = require('../apiDB');
const controllers = require('../controllers');

class Storage{
  constructor() {
    this.buildsList = [];
    this.agents = [];
    this.agentsAll = [];
    this.agentsFree = [];
    this.interval = 5000; // интервал повторения для поиска свободных билд-агентов
  }

  updateSettings(settings) {
    this.settings = settings;
  }

  updateBuildsList(newBuildsList) {
    this.buildsList = newBuildsList.filter(build => build.status === 'Waiting').map(build => build.id);
    this.searchAgent();
  }

  registerAgent({ host, port, }) {
    const url = `${host}:${port}`;
    // Регистриуем, только если агента с таким url еще нет
    if (this.agents.some(agent => agent.url === url)) {
      return false;
    } else {
      this.agents.push({
        url: `${host}:${port}`,
        status: 'free'
      });
      return true;
    }
  }

  setAgentStatus(buildId, status) {
    const agent = this.agents.find(agent => agent.buildId = buildId);
    agent.status = status;
    delete agent.buildId;
  }


  searchAgent() {
    const freeAgents = this.agents.filter(agent => agent.status === 'free');
    if (freeAgents.length) {
      console.log('There are free build-agents');
      this.assignBuildToAgent(freeAgents[0]);
    } else {
      console.log('There is no free build-agents');
      setTimeout(this.searchAgent.bind(this), this.interval);
    }
  }

  async assignBuildToAgent(agent) {
    const builds = this.buildsList.filter(build => build.status === 'Waiting');
    const build = builds[builds.length - 1]; // берем первый из ожидающих билда коммитов (наиболее старый)
    // const repoSettings = await controllers.getSettings();
    const params = {
      buildId: build.id,
      commitHash: build.commitHash,
      repoName: repoSettings.repoName,
      buildCommand:repoSettings.buildCommand
    };

    agent.builId = build.id; // Запоминаем, какой buildId назнавяен агенту
    agent.status = 'busy'; // Меняем статус агента на Занят
    console.log('Build was send to build-agent: ', agentURL, ' with paramd: ', params);
    apiAgent.startBuild(agentURL, params);
    console.log('Build was send to build-agent: ', agentURL, ' with paramd: ', params);
  }
}

module.exports = new Storage();
