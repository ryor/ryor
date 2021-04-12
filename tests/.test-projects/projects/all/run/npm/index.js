export const args = {
  update: {
    alias: 'u',
    description: 'Updates dependencies'
  }
}

export const description = () => 'Runs preconfigured NPM commands'

export const run = args => console.log('Running NPM command')
