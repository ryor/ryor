const {EOL} = require('os')
let errors = ''

process.stdin.resume()
process.stdin.on('data', chunk => errors += chunk)
process.stdin.on('end', () =>
{
  if (errors)
  {
    process.stderr.write(`${EOL}${errors}${EOL}`)
    process.exit(1)
  }
})
