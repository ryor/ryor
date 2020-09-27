export const description = () => 'Runs preconfigured NPM commands'

export const usage = {
  args: '<command>',
  body: '-u  --update  Updates dependencies'
}

export const run = args => console.log('Running NPM command')
