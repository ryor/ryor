const {log, shell:{series}} = require('./utils')

module.exports = {
  description: 'Runs production build, increments package.json patch numbers, commits changes to Git repository, pushes commit to Github and publishes to NPM',
  script: series(
    'nps build',
    'node run/utils/increment-patch-number.js',
    'git add --all',
    'git commit',
    'git push',
    'npm publish'
  )
}
