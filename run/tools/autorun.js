const description = 'Replaces ryor module export with autorun function call'

function run()
{
  return () =>
  {
    const {readFileSync, writeFileSync} = require('fs')
    const {EOL} = require('os')
    const {resolve} = require('path')
    const modulePath = resolve(__dirname, '../../build/index.js')
    const moduleCode = readFileSync(modulePath).toString()
      .replace(`Object.defineProperty(exports, '__esModule', { value: true });${EOL}${EOL}`, '')
      .replace('exports.run = run;', 'run(process.argv.slice(2));')

    writeFileSync(modulePath, moduleCode)
  }
}

module.exports = {description, run}
