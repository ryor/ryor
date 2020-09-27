export const description = 'Tests code'

export const usage = { args: '(with Jest!)' }

export const run = args => console.log(`Testing with${args.length > 0 && args[0] === 'coverage' ? '' : 'out'} coverage results`)
