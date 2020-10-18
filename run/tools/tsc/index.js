export const description = 'Transpiles TypeScript into JavaScript ES modules'

export const usage = () => require('../../utils/usage').composeUsageInformation([
  ['-q  --quiet', 'No output unless errors are encountered by TypeScript compiler']
])

export const run = args => {
  const { quiet } = require('minimist')(args, {
    alias: { q: 'quiet' },
    boolean: ['q', 'quiet']
  })
  const sequence = ['tsc -p run/tools/tsc/config.json']

  if (!quiet) sequence.unshift('log -w Transpiling TypeScript')

  return sequence
}
