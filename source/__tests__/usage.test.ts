import {bold} from 'chalk'
import {EOL} from 'os'
import {resolve} from 'path'
import {composeItemsList, composeUsageInformation, outputUsageInformation} from '../usage'

export const expectedTaskUsageInformation:{[key:string]:string} = {

  'only-tasks':

`${bold('Usage:')} node run ${bold('<tasks...>')}

${bold('Tasks:')}

  ${bold('build ')}    Builds project
  ${bold('deploy')}    No description provided
  ${bold('test  ')}    Tests project`,

  'tasks-and-tools':

`${bold('Usage:')} node run ${bold('<tasks...>')}

${bold('Tasks:')}

  ${bold('build ')}    Builds project
  ${bold('deploy')}    No description provided
  ${bold('test  ')}    Tests project
  ${bold('tools ')}    Lists available tools`

}

export const expectedToolsUsageInformation:string =

`${bold('Usage:')} node run ${bold('<tools...>')}

${bold('Tools:')}

  ${bold('bundler   ')}    Bundles code
  ${bold('tester    ')}    No description provided
  ${bold('transpiler')}    Transpiles code`

const rootDirectoryPath:string = resolve(__dirname, '../..')

test('Composes items lists', ():void =>
{
  expect(composeItemsList('Items', new Map([['key', 'value']]))).toBe(`${bold(`Items:`)}${EOL}${EOL}  ${bold('key')}    value`)
  expect(composeItemsList('Items', new Map([['key', 'value'], ['long-key', 'value']]))).toBe(`${bold(`Items:`)}${EOL}${EOL}  ${bold('key     ')}    value${EOL}  ${bold('long-key')}    value`)
})

test('Composes usage information', ():void =>
{
  let testProjectDirectoryPath:string

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/only-tasks')
  process.chdir(testProjectDirectoryPath)
  expect(composeUsageInformation('tasks')).toBe(expectedTaskUsageInformation['only-tasks'])
  process.chdir(rootDirectoryPath)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/only-tools')
  process.chdir(testProjectDirectoryPath)
  expect(composeUsageInformation('tools')).toBe(expectedToolsUsageInformation)
  process.chdir(rootDirectoryPath)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  process.chdir(testProjectDirectoryPath)
  expect(composeUsageInformation('tasks')).toBe(expectedTaskUsageInformation['tasks-and-tools'])
  expect(composeUsageInformation('tools')).toBe(expectedToolsUsageInformation)
  process.chdir(rootDirectoryPath)
})

test('Outputs usage information', ():void =>
{
  let testProjectDirectoryPath:string = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  let consoleLogValue:string = ''

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  process.chdir(testProjectDirectoryPath)

  outputUsageInformation()

  process.chdir(rootDirectoryPath)

  expect(consoleLogValue.trim()).toBe(expectedTaskUsageInformation['tasks-and-tools'])

  jest.clearAllMocks()
})
