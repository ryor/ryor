export const description = 'Transpiles TypeScript into JavaScript ES modules'

export const usage = () => require('../../utils/usage').composeUsageInformation([
  ['-s  --silent', 'No output unless errors are encountered by TypeScript compiler']
])

export const run = args => {
  const { silent } = require('minimist')(args, {
    alias: { s: 'silent' },
    boolean: ['s:', 'silent']
  })
  const sequence = ['tsc -p run/tools/tsc/config.json']

  if (!silent) sequence.unshift('log -w Transpiling TypeScript')

  return sequence
}
