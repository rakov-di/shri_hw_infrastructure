const path = require('path');
const fs = require('fs');
const util = require('util');
// const rr = require("rimraf");
const cp = require('child_process');

const rootPath = path.resolve(__dirname, '../');
const spawn = util.promisify(cp.spawn);
const exec = util.promisify(cp.exec);
// const rimraf = util.promisify(rr);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);

const getConfig = (key) => {
  const configRaw = fs.readFileSync(path.join(rootPath, 'agent-conf.json'));
  const config = JSON.parse(configRaw);
  return key ? config[key] : config;
};

module.exports = { path, spawn, exec, stat, readFile, getConfig };
