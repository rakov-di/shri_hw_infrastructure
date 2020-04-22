const dbControllers = require('../controllers/dbControllers');
const agentControllers = require('../controllers/agentControllers');

// console.log(typeof dbControllers);
// console.log(typeof agentControllers);
// Информация, хранящаяся об агенте
// this.agents = [{
//   url: 'http://localhost:8001
//   isFree: false || true
//   buildId: 2134213411
// }, {...}, {...}]

// Информация, хранящаяся о билдах соответсвует виду, как она выдается из apiBD.
// При получении билда от агента ему меняется status

class Storage{
  constructor() {
    this.buildsList = [];
    this.waitingBuilds = null;
    this.agents = [];
    this.interval = 5000; // интервал повторения для поиска свободных билд-агентов
  }

  async getInitialData() {
    const response = await dbControllers.getInitialData();
    if (response) {
      this.updateStore(response);
      await this.searchAgent();
    } else {
      console.log('Next try in an 10000 ms');
      setTimeout(this.getInitialData.bind(this), 10000)
    }
  }

  updateStore([ responseSettings, responseBuildsList ]) {
    this.settings = responseSettings.data.data;
    this.buildsList = responseBuildsList.data.data.filter(build => ['Waiting','InProgress'].includes(build.status));
    this.waitingBuilds = responseBuildsList.data.data.filter(build => build.status === 'Waiting').length;
  }

  registerAgent({ host, port }) {
    const url = `${host}:${port}`;
    // Регистрируем, только если агента с таким url еще нет
    if (this.agents.some(agent => agent.url === url)) {
      return false;
    } else {
      this.agents.push({
        url: `${host}:${port}/build`,
        isFree: true
      });
      console.log('Build agent: ', `${host}:${port}`, 'successfully registered');
      return true;
    }
  }

  // Ищем агент по buildId, который был ему назначен при выдаче задания на билд
  updateAgentStatus(buildId, isFree) {
    const agent = this.agents.find(agent => agent.buildId = String(buildId));
    agent.isFree = isFree;
    agent.duration = new Date() - agent.dateTime;
    console.log('crab', agent.duration);
    agent.buildId = null;
    agent.dateTime = null;
    return agent.duration;
  }

  updateBuildStatus(buildId, status) {
    const build = this.buildsList.find(build => build.id === buildId);
    build.status = status;
    status === 'InProgress' && this.waitingBuilds--; // уменьшаем кол-во билдов, требующих агента
  }

  deleteBuild(buildId) {
    delete this.buildsList.find(build => build.id = buildId);
    console.log('crab', this.buildsList)
  }

  async searchAgent(agentNum = 0) {
    // Ищем агенты со статусом Свободен
    const freeAgents = this.agents.filter(agent => agent.isFree);
    // Если есть - пытаемся назначить ему билд
    if (freeAgents.length) {
      console.log('There are free build-agents');
      // Если агенты не отвечают, а мы уже перебрали весь массив - заходим на второй круг
      agentNum = (agentNum < freeAgents.length) ? agentNum : 0;
      console.log(`Try to assign build to build-agent ${freeAgents[agentNum]}`);
      const isAssigned = await this.assignBuildToAgent(freeAgents[agentNum]);
      if (isAssigned) {
        console.log(`Build succesfully assigned to build-agent ${freeAgents[agentNum].url}`);
        // Если билд назначен (агент ответил) и еще есть билды со статусом Waiting - ищем следующего свободного агента,
        if (this.waitingBuilds) {
          this.searchAgent();
        } else {
          console.log('Заглушка для запроса за новым билд листом, т.к. старый весь уже сбилжен или распределен по агентам')
        }
      } else {
        console.log(`Build-agents didn't assigned. Try next free build-agent`);
        // Если агент не ответил - пробуем назначить билд следующему агенту
        this.searchAgent(agentNum + 1)
      }
    } else {
      // Если агентов нет - повторяем поиск через интервал
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
      repoName: this.settings.repoName,
      buildCommand:this.settings.buildCommand
    };
    agent.buildId = String(build.id); // Запоминаем, какой buildId назначен агенту
    agent.isFree = false; // Меняем статус агента на Занят

    const isAssigned = await agentControllers.startBuild(agent.url, params);
    this.updateBuildStatus(build.id,'InProgress');
    agent.dateTime = new Date();
    await dbControllers.startBuild({ buildId: agent.buildId, dateTime: agent.dateTime.toISOString() });
    console.log(`Build ${agent.buildId} successfully started in DB ad ${agent.dateTime}`);
    return isAssigned;

    // try {
    //   console.log('Build status for build ', agent.buildId, 'was updeted on: ', agent.dateTime);
    // } catch(err) {
    //   console.log(err);
    // }
  }
}

module.exports = new Storage();
