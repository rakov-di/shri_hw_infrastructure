const { apiDB } = require('../apiDB');
const storage = require('../storage');


let apiBDErrorsCount = 0; // текущее число ошибок при обращении к БД
const maxApiBDErrorsCount = 2; // максимальное число обращений с ошибками, после которого надо увеличивать интервал обращения
const shortInterval = 2000; // короткий интервал повторения запроса
const longInterval = 10000; // увеличиенный интервал посторения запроса

const controllers = {
  // Получения настроек текущего репозитория (repoName и buildCommand)
  async getSettings() {
    try {
      const response = await apiDB.getSettings(); // Узнаем имя текущего репозитория и билд комманду для него
      console.log('Repo settings successfully got: ', response.data.data);
      storage.updateSettings(response.data.data);
    } catch(err) {
      console.error('Can not get repo Settings')
    }
  },

  // Получения списка сборок
  async getBuildsList() {
    try {
      const response = await apiDB.getBuildsList();
      apiBDErrorsCount = 0; // После успешного запроса обнуляем счетчик ошибочных запросов

      if (response.data.data.length) { // если список билдов не пустой - сохраняем его для дальнейшей работы
        console.log('Build list successfully got: ', response.data.data.length);
        storage.updateBuildsList(response.data.data);
      } else { // если пустой - потвторяем запрос к БД позже
        console.log('Build list is empty, I will try again later');
        setTimeout(controllers.getBuildsList, longInterval);
      }
    } catch(error) {
      // Если БД не ответила - пробуем еще 2 раза с коротким интервалом,
      // если все еще не отвечает - продолжаем спрашивать пока не ответит, но уже через длинный интервал
      apiBDErrorsCount++;
      console.error(`Build list didn't get because of error: ${error.message}`);
      console.log('Error count: ', apiBDErrorsCount);
      const interval = (apiBDErrorsCount <= maxApiBDErrorsCount) ? shortInterval: longInterval;
      console.log('Interval: ', interval);
      setTimeout(controllers.getBuildsList, interval);
    }
  },
};

module.exports = controllers;
