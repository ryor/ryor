export const description = 'Minifies production build code with Terser'

export const run = args => {
  const { quiet } = require('minimist')(args, {
    alias: { q: 'quiet' },
    boolean: ['q', 'quiet']
  })
  const sequence = []

  if (!quiet) sequence.push('log -w Minifying module with Terser')

  sequence.push('terser build/index.js --compress --mangle --output build/index.js')

  return sequence
}
