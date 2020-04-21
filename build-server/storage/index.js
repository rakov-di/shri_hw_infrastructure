const apiDB = require('../api/apiDB');
const apiAgent = require('../api/apiAgent');
// const { dbControllers, agentControllers } = require('../controllers');
const dbControllers = require('../controllers/dbControllers');
const agentControllers = require('../controllers/agentControllers');


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

  updateSettings(settings) {
    this.settings = settings;
  }

  async updateBuildsList(newBuildsList) {
    this.buildsList = newBuildsList.filter(build => build.status === 'Waiting');
    this.waitingBuilds = this.buildsList.length;
    // this.buildsList.forEach()
    await this.searchAgent();
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
    console.log('crab1', agent);
    agent.isFree = isFree;
    delete agent.buildId;
  }

  updateBuildStatus(buildId, status) {
    const build = this.buildsList.find(build => build.id === buildId);
    build.status = status;

    console.log('crab updatestatus', buildId);
    console.log(this.buildsList);

    status === 'InProgress' && this.waitingBuilds--; // уменьшаем кол-во билдов, требующих агента
  }

  deleteBuild(buildId) {
    delete this.buildsList.find(build => build.id = buildId);
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
        console.log('crab builds left', this.waitingBuilds );
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
    console.log(this.buildsList);
    const builds = this.buildsList.filter(build => build.status === 'Waiting');
    const build = builds[builds.length - 1]; // берем первый из ожидающих билда коммитов (наиболее старый)
    // const repoSettings = await controllers.getSettings();
    const params = {
      buildId: build.id,
      commitHash: build.commitHash,
      repoName: this.settings.repoName,
      buildCommand:this.settings.buildCommand
    };
    console.log(build);
    console.log(build.id);
    agent.buildId = String(build.id); // Запоминаем, какой buildId назначен агенту
    agent.isFree = false; // Меняем статус агента на Занят
    console.log('crab', agent);

    const isAssigned = await agentControllers.startBuild(agent.url, params);
    this.updateBuildStatus(build.id,'InProgress');
    return isAssigned;

    // try {
    //   agent.startTime = Date();
    //   // await dbControllers.startBuild({ buildId: agent.buildId, startTime: agent.startTime});
    //   console.log('Build status for build ', agent.buildId, 'was updeted on: ', agent.startTime);
    // } catch(err) {
    //   console.log(err);
    // }
  }
}

module.exports = new Storage();
