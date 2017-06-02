const {log} = require('./utils')

module.exports = {
  description: 'Validates build completes successfully, increments package.json patch number, commits changes to Git repository and pushes commit',
  script: log.task('publish')
}
