const {log, shell: {series}} = require('./utils')

module.exports = {
  description: 'Checks TypeScript for errors with TSLint',
  default: series(
    'echo',
    'nps tools.tslint',
    log.success('No errors found.'),
    'echo'
  )
}
