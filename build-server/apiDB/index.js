const https = require('https');
const axios = require('axios');
const helpers = require('../utils/helpers');

const config = helpers.getConfig();
const axiosAPI = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    Authorization: "Bearer " + config.apiToken
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

const apiDB = {
  // Получение настроек репозитория - чтобы отправлять билд-агенту имя репозитория и команду билда
  async getSettings() {
    return await axiosAPI.get('/conf')
  },

  // Получения списка сборок
  async getBuildsList() {
    return await axiosAPI.get('/build/list')
  },
};

module.exports = { apiDB };
