// const util = require('util');
const path = require('path');
const fs = require('fs');

const rootPath = path.resolve(__dirname, '../');
// const readFile = util.promisify(fs.readFile);

const getConfig = (key) => {
  const configRaw = fs.readFileSync(path.join(rootPath, 'server-conf.json'));
  const config = JSON.parse(configRaw);
  return key ? config[key] : config;
};

module.exports = { getConfig };
