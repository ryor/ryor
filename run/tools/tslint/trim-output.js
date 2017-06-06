const {EOL} = require('os')
let data = ''

process.stdin.resume()
process.stdin.on('data', chunk => data += chunk)
process.stdin.on('end', () =>
{
  if (data)
  {
    process.stderr.write(`${EOL}${data}${EOL}`)
    process.exit(1)
  }
})
