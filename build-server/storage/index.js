class Storage{
  constructor() {
    this.buildsList = [];
  }

  update(newBuildsList) {
    this.buildsList = newBuildsList.filter(build => build.status === 'Waiting').map(build => build.id)
    console.log(this.buildsList)
  }
}

module.exports = new Storage();
