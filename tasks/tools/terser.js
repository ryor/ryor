export const description = 'Minifies production build code with Terser'

export const args = {
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered'
  }
}

export const run = ({ quiet }) => {
  const sequence = []

  if (!quiet) sequence.push('log -w Minifying module with Terser')

  sequence.push('terser build/index.js --compress --mangle --toplevel --output build/index.js')

  return sequence
}
