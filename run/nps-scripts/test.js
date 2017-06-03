const {shell: {rm, series}} = require('./utils')

module.exports = {
  description: 'Transpiles TypeScript (including tests) and tests JavaScript using Jest with verbose output and coverage results',
  script: series(
    'echo',
    rm('build coverage'),
    'nps build._test tools.jest',
    rm('build coverage'),
    'echo'
  )
}
