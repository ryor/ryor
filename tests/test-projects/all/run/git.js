export const args = {
  commit: {
    alias: 'c',
    boolean: true,
    description: 'Commits code'
  }
}

export const description = 'Runs preconfigured Git commands'

export const run = args => console.log('Running Git command')
