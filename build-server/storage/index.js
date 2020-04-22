const controllersDB = require('../controllers/controllersDB');
const controllersAgent = require('../controllers/controllersAgent');

// Информация, хранящаяся об агенте
// this.agents = [{
//   url: 'http://localhost:8001
//   isFree: false || true
//   buildId: 2134213411,
//   dateTime: ...,
//   duration: ...
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
    const response = await controllersDB.getInitialData();
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
    agent.buildId = null;
    agent.dateTime = null;
    return agent.duration;
  }

  updateBuildStatus(buildId, status) {
    const build = this.buildsList.find(build => build.id === buildId);
    build.status = status;
    status === 'InProgress' && this.waitingBuilds--; // уменьшаем кол-во билдов, требующих сборки (происходит в момент назначения билду билд-агента)
  }

  async searchAgent(agentNum = 0) {
    // Ищем агенты со статусом Свободен
    const freeAgents = this.agents.filter(agent => agent.isFree);
    // Если есть - пытаемся назначить ему билд
    if (freeAgents.length) {
      console.log('There are free build-agents');
      // Если агенты не отвечают, а мы уже перебрали весь массив - заходим на второй круг
      agentNum = (agentNum < freeAgents.length) ? agentNum : 0;
      const assignedBuild = await this.assignBuildToAgent(freeAgents[agentNum]);
      if (assignedBuild) {
        console.log(`Build successfully assigned to build-agent ${freeAgents[agentNum].url}`);
        // this.checkIsAgentReachable(freeAgents[agentNum]);
        this.startBuildInDB(assignedBuild, freeAgents[agentNum]);
      } else {
        console.log(`Build-agents didn't assigned. Try next free build-agent`);
        // Если агент не ответил - пробуем назначить билд следующему агенту
        this.searchAgent.bind(this)(agentNum + 1);
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

    return await controllersAgent.startBuild(agent.url, params) ? build : false;
  }

  async startBuildInDB(build, agent) {
    agent.dateTime = new Date();
    this.updateBuildStatus(build.id,'InProgress');
    const isStarted = await controllersDB.startBuild({ buildId: agent.buildId, dateTime: agent.dateTime.toISOString() });
    if (isStarted) {
      if (this.waitingBuilds) {
        this.searchAgent();
      } else {
        this.getInitialData();
      }
    } else {
      // Пробуем, пока БД не ответит. В реальности, надо прекращать через
      // сколько-то попыток (а то ж зависнет все тут) и что-то делать с билдом -
      // то ли отменять и зановов собирать, только сохранять и позже
      // возобновлять попытки
      setTimeout(this.startBuildInDB.bind(this, build, agent), 2000);
    }
  }

  async finishBuild(params) {
    const isFinish = await controllersDB.finishBuild(params);
    if (!isFinish) setTimeout(this.finishBuild.bind(this, params), 2000);
  }

  // async checkIsAgentReachable({ url, buildId }) {
  //   const isReachable = await controllersAgent.checkIsAgentReachable(url);
  //   // Если агент доступен И он все еще существует в списке агентов - продолжаем пинговать
  //   if (isReachable && this.agents.some(agent => agent.url === url)) {
  //     setTimeout(this.checkIsAgentReachable.bind(this, url), 2000);
  //   } else {
  //     // Удаляем агента
  //     const idx = this.agents.findIndex(agent => agent.url === url);
  //     this.agents.splice(idx, 1);
  //     // Отменяем билд
  //     await controllersDB.cancelBuild({ buildId })
  //   }
  // }

}

module.exports = new Storage();
