export const description = 'Runs Gitflow-esque Git commands'

export const commands = {
  branch: {
    description: 'Creates feature or release branches',
    args: {
      feature: {
        alias: 'f',
        description: 'Creates feature branch'
      },
      release: {
        alias: 'r',
        description: 'Creates release branch'
      }
    }
  },
  merge: {
    description: 'Merges current feature or release branch into develop or main branches respectively'
  }
}

export const run = ({ command, ...args }) => {
  console.error({ command, args })
}
