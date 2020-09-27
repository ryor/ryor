export const description = 'Minifies production build code with Terser'

export const run = args => {
  const { silent } = require('minimist')(args, {
    alias: { s: 'silent' },
    boolean: ['s:', 'silent']
  })
  const sequence = []

  if (!silent) sequence.push('log -w Minifying module with Terser')

  sequence.push('terser build/index.js --compress --mangle --output build/index.js')

  return sequence
}
