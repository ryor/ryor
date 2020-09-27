export const description = () => 'Runs preconfigured Git commands'

export const usage = {
  args: '<command>',
  body: '-c  --commit  Commits code'
}

export const run = args => console.log('Running Git command')
