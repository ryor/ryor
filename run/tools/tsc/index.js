const  description = 'Transpiles TypeScript into JavaScript ES modules'

const run = [
  'log -w Transpiling TypeScript',
  'tsc -p run/tools/tsc/config.json'
]

module.exports = {description, run}
