import {resolve} from 'path'
import {run} from '..'
import {Message} from '../strings'
import {expectedTaskUsageInformation, expectedToolsUsageInformation} from './usage.test'

const rootDirectoryPath:string = resolve(__dirname, '../..')

test('Outputs RunnablesRequired message when no runnables have been defined', ():void =>
{
  let consoleLogValue:string = ''
  let testProjectDirectoryPath:string

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/empty')
  process.chdir(testProjectDirectoryPath)
  run(['build'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(Message.Run.RunnablesRequired)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/empty-run')
  process.chdir(testProjectDirectoryPath)
  run(['build'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(Message.Run.RunnablesRequired)

  jest.clearAllMocks()
})

test('Outputs tasks usage information when run function is executed with an empty args array', ():void =>
{
  const testProjectDirectoryPath:string = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  let consoleLogValue:string = ''

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  process.chdir(testProjectDirectoryPath)
  run([])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(expectedTaskUsageInformation['tasks-and-tools'])

  jest.clearAllMocks()
})

test('Outputs tools usage information when "tools" is only arg passed to run function', ():void =>
{
  const testProjectDirectoryPath:string = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  let consoleLogValue:string = ''

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  process.chdir(testProjectDirectoryPath)
  run(['tools'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(expectedToolsUsageInformation)

  jest.clearAllMocks()
})

test('Outputs tasks usage information when "tools" is only arg passed to run function but no tools are defined', ():void =>
{
  let consoleLogValue:string = ''
  let testProjectDirectoryPath:string

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/only-tasks')
  process.chdir(testProjectDirectoryPath)
  run(['tools'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(expectedTaskUsageInformation['only-tasks'])

  jest.clearAllMocks()
})

test('Outputs tasks usage information when runnable cannot be resolved', ():void =>
{
  const testProjectDirectoryPath:string = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  let consoleLogValue:string = ''

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  process.chdir(testProjectDirectoryPath)
  run(['invalid'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(expectedTaskUsageInformation['tasks-and-tools'])

  jest.clearAllMocks()
})

test('Outputs tasks usage information when "nps" is only arg passed to run function', ():void =>
{
  const testProjectDirectoryPath:string = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  let consoleLogValue:string = ''

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  process.chdir(testProjectDirectoryPath)
  run(['nps'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(expectedTaskUsageInformation['tasks-and-tools'])

  jest.clearAllMocks()
})

test('Outputs tasks usage information when "nps" is first arg passed to run function and subsequent args cannot be resolved into NPS scripts', ():void =>
{
  const testProjectDirectoryPath:string = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  let consoleLogValue:string = ''

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  process.chdir(testProjectDirectoryPath)
  run(['nps', 'invalid'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(expectedTaskUsageInformation['tasks-and-tools'])

  jest.clearAllMocks()
})

test('Runs single NPS script when resolved as runnable', ():void =>
{
  const testProjectDirectoryPath:string = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  let consoleLogValue:string = ''

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  process.chdir(testProjectDirectoryPath)
  run(['test'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe('')

  jest.clearAllMocks()
})

test('Runs NPS scripts when listed in series after initial "nps" arg', ():void =>
{
  const testProjectDirectoryPath:string = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  let consoleLogValue:string = ''

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  process.chdir(testProjectDirectoryPath)

  run(['nps', 'test'])
  expect(consoleLogValue.trim()).toBe('')

  run(['nps', 'test', 'deploy'])
  expect(consoleLogValue.trim()).toBe('')

  run(['nps', 'tester.quiet', 'tester.verbose', 'transpiler', 'bundler'])
  expect(consoleLogValue.trim()).toBe('')

  process.chdir(rootDirectoryPath)

  jest.clearAllMocks()
})
