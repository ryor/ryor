const {bold} = require('chalk')

module.exports = {
  description: `Runs Jest tests. Configuration file: ${bold('run/tools/jest/config.json')}. TypeScript preproccesor: ${bold('run/tools/jest/preproccesor.js')}.`,
  nps: {
    default: 'jest -c run/tools/jest/config.json',
    coverage: 'jest -c run/tools/jest/config.json --coverage'
  }
}
