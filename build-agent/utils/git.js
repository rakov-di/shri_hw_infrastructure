const path = require('path');
const helpers = require('./heleprs');

const localRepos = '_localRepos';

const cloneRepo = async (repoName) => {
  const repoUrl = `git@github.com:${repoName}.git`;
  const repoLocalDir = path.resolve(process.cwd(), localRepos, repoName);

  // Проверяем, существует ли указанный репозиторий на GitHub
  try {
    await helpers.exec(`git ls-remote ${repoUrl}`);
    console.log(`Git repo ${repoUrl} exist`);
  }
  catch(err) {
    console.error(`Can't check if repo ${repoUrl} exists because of error: `, err.message);
  }

  // Проверяем, есть ли на сервере локальная папка с ранее склонированным туда репозиторием
  // Если есть - удаляем его
  if (await isLocalRepoExist(repoLocalDir)) {
    await helpers.rimraf(repoLocalDir);
  }

  // Клонируем указанный репозиторий в локальную папку на сервере
  try {
    await helpers.exec(`git clone ${repoUrl} ${repoLocalDir}`);
    console.log(`Git repo ${repoUrl} successfully cloned`);
  }
  catch(err) {
    console.error(`Can't clone repository ${repoUrl} because of error: `, err.message);
  }
};

const isLocalRepoExist = async (dir) => {
  try {
    const stat = await helpers.stat(dir);
    return stat.isDirectory();
  }
  catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      console.error(e);
    }
  }
};

const makeBuild = async (repoName, commitHash, buildCommand) => {
  const repoLocalDir = path.resolve(process.cwd(), localRepos, repoName);

  try {
    await helpers.exec(`git checkout ${commitHash}`, { cwd: repoLocalDir });
    console.log(`Successfully checkout to commit with hash ${commitHash}`);
  }
  catch(err) {
    console.log(`Can't checkout to commit with hash ${commitHash} because of error: `, err.message);
  }

  try {
    await helpers.exec(`npm i`, { cwd: repoLocalDir });
    console.log(`Successfully installed npm-dependencies for commit with hash ${commitHash}`);
  } catch (err) {
    console.log(`Can't install npm-dependencies for commit with hash ${commitHash} because of error: `, err.message);
  }

  try {
    const result = await helpers.exec(`${buildCommand}`, { cwd: repoLocalDir });
    console.log(`Successfully apply build command ${buildCommand}`);
    return result;
  } catch(err) {
    console.log(`Can't apply build command ${buildCommand} because of error: `, err.message);
  }
};

module.exports = { cloneRepo, makeBuild };
