export const description = 'Builds'

export const args = {
  develop: {
    alias: 'd',
    description: 'Runs development build',
    type: 'boolean'
  }
}

export const run = 'echo Building...'
