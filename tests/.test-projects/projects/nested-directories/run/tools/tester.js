export const args = {
  quiet: {
    alias: 'q',
    boolean: true,
    description: 'Stays quiet'
  }
}

export const description = 'Tests code'

export const run = (args) => (args.length > 0 && args[0] === 'coverage' ? 'testing with coverage results' : 'testing without coverage results')
