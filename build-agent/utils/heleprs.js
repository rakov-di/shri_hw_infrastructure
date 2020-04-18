const path = require('path');
const fs = require('fs');

const rootPath = path.resolve(__dirname, '../');

const getConfig = (key) => {
  const configRaw = fs.readFileSync(path.join(rootPath, 'config.json'));
  const config = JSON.parse(configRaw);
  return key ? config[key] : config;
};

module.exports = { getConfig };
