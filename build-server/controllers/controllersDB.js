const { apiDB } = require('../api');
// const storage = require('../storage');

const controllersDB = {

  async getInitialData() {
    try {
      // Первичные запросы за билд-листом и настройками репозитория
      // Без этих данных билдить невозможно, поэтому
      // оба запросы будут повторяться, пока не получат настройки и НЕ пустой список билдов
      const [responseSettings, responseBuildsList] = await Promise.all([
        controllersDB.getSettings(),
        controllersDB.getBuildsList()
      ]);
      if (responseBuildsList.data.data.some(build => build.status === 'Waiting')) {
        console.log('Repo settings and build list successfully got');
        return [responseSettings, responseBuildsList];
      } else {
        console.log(`There are no builds with status Waiting in buildsList`);
        return false;
      }
    } catch(err) {
      console.error(err.message);
      return false;
    }
  },

  // Получения настроек текущего репозитория (repoName и buildCommand)
  async getSettings() {
    try {
      return await apiDB.getSettings(); // Узнаем имя текущего репозитория и билд комманду для него
    } catch(err) {
      throw new Error(`Can't get Repo Settings because of error: ${err.message}`);
    }
  },

  // Получения списка сборок
  async getBuildsList() {
    try {
      return await apiDB.getBuildsList();
    } catch(err) {
      throw new Error(`Can't get Builds List because of error: ${err.message}`);
    }
  },

  async startBuild(params) {
    try {
      await apiDB.startBuild(params);
      console.log(`Build ${params.buildId} successfully started in DB at ${params.dateTime}`);
      return true;
    } catch(err) {
      console.error(`Can't start build in DB because of an Error: ${err.message}`);
      return false;
    }
  },

  async finishBuild(params) {
    try {
      await apiDB.finishBuild(params);
      console.log(`Build ${params.buildId} successfully finished in DB`);
      return true;
    } catch(err) {
      console.error(`Can't finish build in DB because of an Error: ${err.message}`);
      return false;
    }
  }

  // async cancelBuild(params) {
  //   try {
  //     await apiDB.cancelBuild(params);
  //     console.log(`Build ${params.buildId} successfully finished in DB`);
  //     return true;
  //   } catch(err) {
  //     console.error(`Can't finish build in DB because of an Error: ${err.message}`);
  //     return false;
  //   }
  // }
};

module.exports = controllersDB;

