const {bold} = require('chalk')
const {resolve} = require('path')
const {composeUsageInformation} = require('../usage')

const expectedUsageInformation = {

  'all':

`${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...

${bold('Tasks:')}

  ${bold('build     ')}    Builds project
  ${bold('deploy    ')}    No description provided
  ${bold('test      ')}    Tests project

${bold('Tools:')}

  ${bold('bundler   ')}    Bundles code
  ${bold('tester    ')}    No description provided
  ${bold('transpiler')}    Transpiles code

${bold('Also available:')}

  ${bold('thing     ')}    No description provided`,

  'only-bin':

`${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...

${bold('thing')}    No description provided`,

  'only-tasks':

`${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...

${bold('Tasks:')}

  ${bold('build ')}    Builds project
  ${bold('deploy')}    No description provided
  ${bold('test  ')}    Tests project`,

  'only-tools':

`${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...

${bold('Tools:')}

  ${bold('bundler   ')}    Bundles code
  ${bold('tester    ')}    No description provided
  ${bold('transpiler')}    Transpiles code`

}
const rootDirectoryPath = resolve(__dirname, '../../..')

test('Composes usage information', () =>
{
  process.chdir(resolve(rootDirectoryPath, 'test-projects/all'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['all'])

  process.chdir(resolve(rootDirectoryPath, 'test-projects/only-bin'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['only-bin'])

  process.chdir(resolve(rootDirectoryPath, 'test-projects/only-tasks'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['only-tasks'])

  process.chdir(resolve(rootDirectoryPath, 'test-projects/only-tools'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['only-tools'])

  process.chdir(rootDirectoryPath)
})
