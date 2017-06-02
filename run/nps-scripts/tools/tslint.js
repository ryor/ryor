const {log, shell: {series}} = require('../utils')

module.exports = {
  description: 'Checks TypeScript for errors with TSLint',
  default: series(
    log.task('Checking TypeScript for errors with TSLint'),
    `tslint -c run/tools/tslint.json -p run/tools/tsc.test.json --type-check 'source/**/*.ts*' 2>&1 >/dev/null | node run/tools/trim-line-breaks`
  )
}
