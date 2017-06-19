import {bold} from 'chalk'
import {resolve} from 'path'
import {getRunnableModules} from '../source/runnables'
import {composeUsageInformation} from '../source/usage'

export const expectedTasksUsageInformation = {

  'only-tasks':

`${bold('Usage:')} node run ${bold('<task|command>')} [args...] [+ <task|command> [args...]] ...

${bold('Tasks:')}

  ${bold('build ')}    Builds project
  ${bold('deploy')}    No description provided
  ${bold('lint  ')}    Lints project
  ${bold('test  ')}    Tests project`,

  'tasks-and-tools':

`${bold('Usage:')} node run ${bold('<task|tool|command>')} [args...] [+ <task|tool|command> [args...]] ...

${bold('Tasks:')}

  ${bold('build ')}    Builds project
  ${bold('deploy')}    No description provided
  ${bold('test  ')}    Tests project
  ${bold('tools ')}    Lists available tools`

}

export const expectedToolsUsageInformation = {

  'only-tools':

`${bold('Usage:')} node run ${bold('<tool|command>')} [args...] [+ <tool|command> [args...]] ...

${bold('Tools:')}

  ${bold('bundler   ')}    Bundles code
  ${bold('tester    ')}    No description provided
  ${bold('transpiler')}    Transpiles code`,

  'tasks-and-tools':

`${bold('Usage:')} node run ${bold('<task|tool|command>')} [args...] [+ <task|tool|command> [args...]] ...

${bold('Tools:')}

  ${bold('bundler   ')}    Bundles code
  ${bold('tester    ')}    No description provided
  ${bold('transpiler')}    Transpiles code`

}

const rootDirectoryPath = resolve(__dirname, '..')

test('Composes usage information', () =>
{
  let runnableModules

  process.chdir(resolve(rootDirectoryPath, 'tests/projects/only-tasks'))
  runnableModules = getRunnableModules()
  expect(composeUsageInformation([], runnableModules)).toBe(expectedTasksUsageInformation['only-tasks'])
  expect(composeUsageInformation(['tools'], runnableModules)).toBe(expectedTasksUsageInformation['only-tasks'])

  process.chdir(resolve(rootDirectoryPath, 'tests/projects/only-tools'))
  runnableModules = getRunnableModules()
  expect(composeUsageInformation([], runnableModules)).toBe(expectedToolsUsageInformation['only-tools'])
  expect(composeUsageInformation(['tools'], runnableModules)).toBe(expectedToolsUsageInformation['only-tools'])

  process.chdir(resolve(rootDirectoryPath, 'tests/projects/tasks-and-tools'))
  runnableModules = getRunnableModules()
  expect(composeUsageInformation([], runnableModules)).toBe(expectedTasksUsageInformation['tasks-and-tools'])
  expect(composeUsageInformation(['tools'], runnableModules)).toBe(expectedToolsUsageInformation['tasks-and-tools'])

  process.chdir(rootDirectoryPath)
})
