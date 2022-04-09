export const description = 'Checks for available dependency updates and updates as neccesary'

export const run = async () => {
  const { promises: { stat } } = await import('fs')
  const fileName = 'package.json'
  let initialModifiedTime

  return [
    async () => {
      initialModifiedTime = (await stat(fileName)).mtimeMs

      return 'ncu -u'
    },
    async () => {
      if ((await stat(fileName)).mtimeMs !== initialModifiedTime) return 'npm install'
    }
  ]
}
