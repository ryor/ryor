const description = 'Adds run function call to module'

function run()
{
  const {readFileSync, writeFileSync} = require('fs')
  const {EOL} = require('os')
  const {resolve} = require('path')
  const modulePath = resolve(__dirname, '../../build/index.js')

  writeFileSync(
    modulePath,
    readFileSync(modulePath).toString()
      .replace(`Object.defineProperty(exports, '__esModule', { value: true });${EOL}${EOL}`, '')
      .replace('exports.run = run;', 'run(process.argv.slice(2));')
  )
}

module.exports = {description, run}
