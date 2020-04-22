const { apiDB } = require('../api');
// const storage = require('../storage');

const dbControllers = {

  async getInitialData() {
    try {
      // Первичные запросы за билд-листом и настройками репозитория
      // Без этих данных билдить невозможно, поэтому
      // оба запросы будут повторяться, пока не получат настройки и НЕ пустой список билдов
      const [responseSettings, responseBuildsList] = await Promise.all([
        dbControllers.getSettings(),
        dbControllers.getBuildsList()
      ]);
      if (responseBuildsList.data.data.length) {
        console.log('Repo settings and build list successfully got');
        return [responseSettings, responseBuildsList];
      } else {
        console.log(`There is no builds with status Waiting in buildsList`);
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
      return await apiDB.startBuild(params)
    } catch(err) {
      console.error(`Can't start build in DB because of en Error: ${err.message}`);
      // Пробуем, пока БД не ответит. В реальности, надо прекращать через
      // сколько-то попыток (а то ж зависнет все тут) и что-то делать с билдом -
      // то ли отменять и зановов собирать, только сохранять и позже
      // возобновлять попытки
      setTimeout(dbControllers.startBuild, 2000);
    }
  },

  async finishBuild(params) {
    try {
      return await apiDB.finishBuild(params);
    } catch(err) {
      console.error(`Can't finish build in DB because of en Error: ${err.message}`);
      setTimeout(dbControllers.finishBuild, 2000);
    }
  }
};

module.exports = dbControllers;

