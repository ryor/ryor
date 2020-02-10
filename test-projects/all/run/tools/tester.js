export const run = args => args.length > 0 && args[0] === 'coverage' ? 'echo testing with coverage results' : 'echo testing without coverage results'
