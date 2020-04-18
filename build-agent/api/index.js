const axios = require('axios').default;

const apiBS = {
  // Зарегистрировать билд-агент на билд-сервере
  async registerAgent(url, params) {
    return await axios.post(url, params);
  },
};

module.exports = apiBS;
