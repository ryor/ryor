export const description = 'Bundles ES modules produced by TypeScript into single CommonJS module with Rollup'

export const usage = () => require('../../utils/usage').composeUsageInformation([[
  '-s  --silent', 'No output unless errors are encountered by Rollup'
]])

export const run = args => {
  const { silent } = require('minimist')(args, {
    alias: { s: 'silent' },
    boolean: ['s:', 'silent'],
    unknown: value => {
      const { bold } = require('chalk')

      throw new Error(`Invalid value ${bold(value)} passed to ${bold('rollup')} tool.`)
    }
  })
  const sequence = []

  if (!silent) sequence.push('log -w Bundling module with Rollup')

  sequence.push(
    'rollup -c run/tools/rollup/config.js --silent',
    'shx rm -rf build/node_modules'
  )

  return sequence
}
