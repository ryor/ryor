const {log, shell:{rm, series}} = require('./utils')

module.exports = {
  description: 'Runs production build, increments package.json patch numbers, commits changes to Git repository, pushes commit to Github and publishes to NPM',
  script: series(
    'echo',
    rm('build coverage'),
    'nps build._test tools.jest',
    'codecov',
    rm('coverage'),
    'echo',
    'nps build._bundle build._dist',
    'node run/utils/increment-patch-number.js',
    'git add --all',
    'git commit',
    'git push',
    'npm publish'
  )
}
