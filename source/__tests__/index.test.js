const {bold} = require('chalk')
const {resolve} = require('path')
const {run} = require('..')

const rootDirectoryPath = resolve(__dirname, '../..')

test('Adds node_modules/.bin directory to PATH if neccesary', () =>
{
  const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(value => {})
  let projectDirectoryPath
  let binDirectoryPath

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/empty')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  run()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(false)

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/empty-run')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  run()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(false)

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/only-tasks')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  run()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(false)

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/only-tools')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  run()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(false)

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/only-bin')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  run()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(true)

  process.env.PATH = process.env.PATH.replace(binDirectoryPath, '')

  projectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/all')
  binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
  process.chdir(projectDirectoryPath)
  run()
  expect(process.env.PATH.includes(binDirectoryPath)).toBe(true)

  process.chdir(rootDirectoryPath)

  consoleLogMock.mockRestore()
})

test('Outputs usage information when no input values are passed to run function', () =>
{
  const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(value => log = value)
  let log = ''

  run()

  expect(log.includes('Usage')).toBe(true)

  consoleLogMock.mockRestore()
})

test('Outputs error messages', () =>
{
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(error => errors.push(error))
  const processExitMock = jest.spyOn(process, 'exit').mockImplementation(exitCode =>
  {
    exitCodes.push(exitCode)

    if (++exits === 2)
      resolver()
  })
  let errors = []
  let exitCodes = []
  let exits = 0
  let resolver

  run(['unresolvable'])

  process.chdir(resolve(rootDirectoryPath, 'test-projects/syntax-error'))
  run(['bundler'])
  process.chdir(rootDirectoryPath)

  return new Promise(resolve =>
  {
    resolver = () =>
    {
      expect(errors.length).toBe(2)
      expect(errors.filter(error => error.trim() === `Could not resolve ${bold('unresolvable')}`).length).toBe(1)
      expect(errors.filter(error => error.includes('SyntaxError')).length).toBe(1)
      expect(exitCodes).toEqual([1, 1])

      consoleErrorMock.mockRestore()
      processExitMock.mockRestore()

      resolve()
    }
  })
})
