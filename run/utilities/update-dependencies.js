export const description = 'Checks for available dependency updates and updates as neccesary'

export const run = () => {
  const { stat } = require('fs/promises')
  const fileName = 'package.json'
  let firstModifiedTime, secondModifiedTime

  return [
    async () => {
      firstModifiedTime = (await stat(fileName)).mtimeMs

      return 'ncu -u'
    },
    async () => {
      secondModifiedTime = (await stat(fileName)).mtimeMs

      if (secondModifiedTime !== firstModifiedTime) return 'npm install'
    }
  ]
}
