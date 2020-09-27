export const description = 'Tests code'

export const usage = '-q  --quiet  Stays quiet.'

export const run = args => args.length > 0 && args[0] === 'coverage' ? 'testing with coverage results' : 'testing without coverage results'
