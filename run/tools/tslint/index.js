const description = 'Checks TypeScript for errors with TSLint'

function run()
{
  return new Promise((resolve, reject) =>
  {
    const {spawn} = require('child_process')
    const childProcess = spawn('tslint', ['-c', 'run/tools/tslint/config.json', '-p', 'run/tools/tsc/config.json', '--type-check', 'source/**/*.ts'])
    let errors = ''

    childProcess.stderr.on('data', data => errors += data)

    childProcess.on('close', code =>
    {
      if (errors)
      {
        const {EOL} = require('os')

        console.error(`${EOL}${errors.trim()}`)

        return reject()
      }

      resolve()
    })
  })
}

module.exports = {description, run}
