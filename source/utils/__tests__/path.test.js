const {bold} = require('chalk')
const {resolve} = require('path')
const {ensureCorrectPathValue} = require('../path')

const rootDirectoryPath = resolve(__dirname, '../../..')

test('Adds node_modules/.bin directory to PATH if neccesary', () =>
{
  const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(value => {})
  let projectDirectoryPath
  let binDirectoryPath

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/empty')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  ensureCorrectPathValue()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(false)

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/empty-run')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  ensureCorrectPathValue()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(false)

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/only-tasks')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  ensureCorrectPathValue()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(false)

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/only-tools')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  ensureCorrectPathValue()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(false)

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/only-bin')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  ensureCorrectPathValue()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(true)

  process.env.PATH = process.env.PATH.replace(binDirectoryPath, '')

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/all')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  ensureCorrectPathValue()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(true)

  process.chdir(rootDirectoryPath)

  consoleLogMock.mockRestore()
})
