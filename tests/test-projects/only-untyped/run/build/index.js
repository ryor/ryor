export const run = args => args.length > 0 && args[0] === 'production' ? 'echo running production build' : 'echo running development build'
