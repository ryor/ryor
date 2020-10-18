export const description = 'Bundles ES modules produced by TypeScript into single CommonJS module with Rollup'

export const usage = () => require('../../utils/usage').composeUsageInformation([[
  '-q  --quiet', 'No output unless errors are encountered by Rollup'
]])

export const run = args => {
  const { quiet } = require('minimist')(args, {
    alias: { q: 'quiet' },
    boolean: ['q', 'quiet'],
    unknown: value => {
      const { bold } = require('chalk')

      throw new Error(`Invalid value ${bold(value)} passed to ${bold('rollup')} tool.`)
    }
  })
  const sequence = []

  if (!quiet) sequence.push('log -w Bundling module with Rollup')

  sequence.push(
    'rollup -c run/tools/rollup/config.js --silent',
    'shx rm -rf build/node_modules'
  )

  return sequence
}
