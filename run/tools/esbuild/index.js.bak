export const description = 'Transpiles TypeScript into JavaScript ES modules'

export const args = {
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered by TypeScript compiler'
  }
}

export const run = async ({ quiet }) => {
  const sequence = ['tsc -p run/tools/tsc/config.json']

  if (!quiet) sequence.unshift('log -w Transpiling TypeScript')

  return sequence
}
