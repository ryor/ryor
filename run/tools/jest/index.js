const {bold} = require('chalk')

const description = `Runs Jest tests. Configuration file: ${bold('run/tools/jest/config.json')}. TypeScript preproccesor: ${bold('run/tools/jest/preproccesor.js')}.`

const run = 'jest -c run/tools/jest/config.json'

module.exports = {description, run}
