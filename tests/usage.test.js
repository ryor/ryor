const {bold} = require('chalk')
const {resolve} = require('path')
const {composeUsageInformation} = require('../source/usage')

const expectedUsageInformation = {

  'all':

`${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...

${bold('Tasks:')}

  ${bold('build ')}    Builds project
  ${bold('deploy')}    No description provided
  ${bold('test  ')}    Tests project

${bold('Tools:')}

  ${bold('bundler   ')}    Bundles code
  ${bold('tester    ')}    No description provided
  ${bold('transpiler')}    Transpiles code

${bold('bin:')} ${bold('thing')}`,

  'only-bin':

`${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...

${bold('bin:')} ${bold('thing')}`,

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
const rootDirectoryPath = resolve(__dirname, '..')

/*
test('Creates Resolvers', () =>
{
  let resolver

  process.chdir(resolve(rootDirectoryPath, `tests/projects/empty`))
  resolver = new Resolver()
  expect(resolver.modules.size).toBe(0)

  process.chdir(resolve(rootDirectoryPath, `tests/projects/empty-run`))
  resolver = new Resolver()
  expect(resolver.modules.size).toBe(0)

  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tasks`))
  resolver = new Resolver()
  expect(resolver.modules.size).toBe(1)
  expect(Array.from(resolver.modules.keys())).toEqual(['tasks'])

  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tools`))
  resolver = new Resolver()
  expect(resolver.modules.size).toBe(1)
  expect(Array.from(resolver.modules.keys())).toEqual(['tools'])

  process.chdir(resolve(rootDirectoryPath, `tests/projects/tasks-and-tools`))
  resolver = new Resolver()
  expect(resolver.modules.size).toBe(2)
  expect(Array.from(resolver.modules.keys())).toEqual(['tasks', 'tools'])

  process.chdir(rootDirectoryPath)
})

test('Resolves runnable modules', () =>
{
  let resolver

  process.chdir(resolve(rootDirectoryPath, `tests/projects/empty`))
  resolver = new Resolver()
  expect(resolver.resolveRunnableModule('build')).toBeUndefined()
  expect(resolver.resolveRunnableModule('bundler')).toBeUndefined()

  process.chdir(resolve(rootDirectoryPath, `tests/projects/empty-run`))
  resolver = new Resolver()
  expect(resolver.resolveRunnableModule('build')).toBeUndefined()
  expect(resolver.resolveRunnableModule('bundler')).toBeUndefined()

  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tasks`))
  resolver = new Resolver()
  expect(resolver.resolveRunnableModule('build')).toBeDefined()
  expect(resolver.resolveRunnableModule('bundler')).toBeUndefined()

  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tools`))
  resolver = new Resolver()
  expect(resolver.resolveRunnableModule('build')).toBeUndefined()
  expect(resolver.resolveRunnableModule('bundler')).toBeDefined()

  process.chdir(resolve(rootDirectoryPath, `tests/projects/tasks-and-tools`))
  resolver = new Resolver()
  expect(resolver.resolveRunnableModule('build')).toBeDefined()
  expect(resolver.resolveRunnableModule('bundler')).toBeDefined()

  process.chdir(rootDirectoryPath)
})

test('Resolves all runnable modules', () =>
{
  let resolver

  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tasks`))
  resolver = new Resolver()
  resolver.resolveAllRunnableModules()
  expect(Array.from(resolver.modules.get('tasks').keys())).toEqual(['build', 'deploy', 'test'])

  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tools`))
  resolver = new Resolver()
  resolver.resolveAllRunnableModules()
  expect(Array.from(resolver.modules.get('tools').keys())).toEqual(['bundler', 'tester', 'transpiler'])

  process.chdir(resolve(rootDirectoryPath, `tests/projects/tasks-and-tools`))
  resolver = new Resolver()
  resolver.resolveAllRunnableModules()
  expect(Array.from(resolver.modules.get('tasks').keys())).toEqual(['build', 'deploy', 'test'])
  expect(Array.from(resolver.modules.get('tools').keys())).toEqual(['bundler', 'tester', 'transpiler'])

  process.chdir(rootDirectoryPath)
})

test('Resolves runnables', () =>
{
  let resolver
  let runnable

  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tasks`))
  resolver = new Resolver()
  expect(resolver.resolveRunnable('build').function).toBeDefined()
  expect(resolver.resolveRunnable('deploy').function).toBeDefined()
  expect(resolver.resolveRunnable('test')).toBeInstanceOf(Runner)
  expect(resolver.resolveRunnable('bundler').command).toBe('bundler')

  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tools`))
  resolver = new Resolver()
  expect(resolver.resolveRunnable('bundler').command).toBe('echo')
  expect(resolver.resolveRunnable('tester').function).toBeDefined()
  expect(resolver.resolveRunnable('transpiler').function).toBeDefined()
  expect(resolver.resolveRunnable('build').command).toBe('build')

  process.chdir(rootDirectoryPath)
})
*/

test('Composes usage information', () =>
{
  process.chdir(resolve(rootDirectoryPath, 'tests/projects/all'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['all'])

  process.chdir(resolve(rootDirectoryPath, 'tests/projects/only-bin'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['only-bin'])

  process.chdir(resolve(rootDirectoryPath, 'tests/projects/only-tasks'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['only-tasks'])

  process.chdir(resolve(rootDirectoryPath, 'tests/projects/only-tools'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['only-tools'])

  process.chdir(rootDirectoryPath)
})
