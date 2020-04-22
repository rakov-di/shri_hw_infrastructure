const { registerAgent, sendBuildResults } = require('../api');

// Если билд-сервер не ответил - пробуем еще ${maxApiBSErrorsCount} раз с коротким интервалом,
// если все еще не отвечает - продолжаем спрашивать пока не ответит, но уже через длинный интервал

let apiBSErrorsCount = 0; // текущее число ошибок при обращении к билд-серверу
const maxApiBSErrorsCount = 2; // максимальное число обращений с ошибками, после которого надо увеличивать интервал обращения
const shortInterval = 2000; // короткий интервал повторения запроса
const longInterval = 10000; // увеличиенный интервал посторения запроса

const bsControllers = {
  async registerAgent() {
    try {
      const response = await registerAgent();
      apiBSErrorsCount = 0;
    } catch(err) {
      console.error('Can not register build agent because of error: ', err.message);
      apiBSErrorsCount++;
      const interval = (apiBSErrorsCount <= maxApiBSErrorsCount) ? shortInterval: longInterval;
      console.log(`Next try in an ${interval} ms`);
      setTimeout(bsControllers.registerAgent, interval);
    }
  },

  async sendBuildResults(params) {
    try {
      const response = await sendBuildResults(params);
      apiBSErrorsCount = 0;
    } catch(err) {
      apiBSErrorsCount++;
      console.error(`Can't send result ti build server because of error: ${err.message}`);
      const interval = (apiBSErrorsCount <= maxApiBSErrorsCount) ? shortInterval: longInterval;
      console.log(`Next try in an ${interval} ms`);
      setTimeout(bsControllers.sendBuildResults, interval);
    }
  }
};

module.exports = bsControllers;
