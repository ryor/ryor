/* eslint-env jest */
const { resolve } = require('path')
const { CommandRunnable } = require('../CommandRunnable')
const rootDirectoryPath = resolve(__dirname, '../../..')

test('Runs command runnables', () => {
  const runnables = [
    new CommandRunnable('echo', ['value']),
    new CommandRunnable('cd', ['test-projects'])
  ]

  return Promise.all(runnables.map(runnable => runnable.run())).then(results => {
    expect(results[0]).toBeUndefined()
    expect(results[1]).toBeUndefined()
    expect(process.cwd()).toBe(resolve(rootDirectoryPath, 'test-projects'))

    process.chdir(rootDirectoryPath)
  })
})
