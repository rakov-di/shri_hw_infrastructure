const { apiDB } = require('../api');
const storage = require('../storage');

let apiBDErrorsCount = 0; // текущее число ошибок при обращении к БД
const maxApiBDErrorsCount = 2; // максимальное число обращений с ошибками, после которого надо увеличивать интервал обращения
const shortInterval = 2000; // короткий интервал повторения запроса
const longInterval = 10000; // увеличиенный интервал посторения запроса

const dbControllers = {

  async getInitialData() {
    try {
      // Первичные запросы за билд-листом и настройками репозитория
      // Без этих данных билдить невозможно, поэтому
      // оба запросы будут повторяться, пока не получат настройки и НЕ пустой список билдов
      // TODO В реальность настройки репы могут измениться, пока получаем билд-лист,
      //  поэтому запросы должны выполняться одновременно.
      //  Но в домашке типа настроки репы не меняются, поэтому если один из запросов успешен
      //  можно его запоминать и повторять только неуспешный запрос
      const [response1, response2] = await Promise.all([
        dbControllers.getSettings(),
        dbControllers.getBuildsList()
      ]);
      if (response2.data.data.length) { // если список билдов не пустой - сохраняем и его и настройки для дальнейшей работы
        apiBDErrorsCount = 0; // После успешного запроса обнуляем счетчик ошибочных запросов
        console.log('Repo settings and build list successfully got');
        storage.updateSettings(response1.data.data);
        storage.updateBuildsList(response2.data.data);
      } else { // если пустой - повторяем запрос к БД позже
        console.log(`Build list is empty, I will try again in an ${longInterval} ms`);
        setTimeout(dbControllers.getInitialData, longInterval);
      }
    } catch(err) {
      // Если БД не ответила - пробуем еще 2 раза с коротким интервалом,
      // если все еще не отвечает - продолжаем спрашивать пока не ответит, но уже через длинный интервал
      apiBDErrorsCount++;
      console.error(err.message);
      const interval = (apiBDErrorsCount <= maxApiBDErrorsCount) ? shortInterval: longInterval;
      console.log(`Next try in an ${interval} ms`);
      setTimeout(dbControllers.getInitialData, interval);
    }
  },

  // Получения настроек текущего репозитория (repoName и buildCommand)
  async getSettings() {
    try {
      return await apiDB.getSettings(); // Узнаем имя текущего репозитория и билд комманду для него
    } catch(err) {
      throw new Error(`Can't get repo Settings because of error: ${err.message}`);
    }
  },

  // Получения списка сборок
  async getBuildsList() {
    try {
      return await apiDB.getBuildsList();
    } catch(err) {
      throw new Error(`Build list didn't get because of error: ${err.message}`);
    }
  },

  async startBuild(params) {
    try {
      return await apiDB.startBuild(params)
    } catch(err) {
      console.error('Can not set status In Progress because of en Error: ', err);
    }
  }
};

module.exports = dbControllers;

