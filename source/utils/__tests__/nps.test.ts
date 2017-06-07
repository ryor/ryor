import {bold} from 'chalk'
import {resolve} from 'path'
import {getNPSScripts, getNPSScriptNames, runNPSScripts} from '../nps'
import {Message} from '../strings'

const rootDirectoryPath:string = resolve(__dirname, '../../..')
const expectedTaskScriptKeys:string[] = ['build', 'deploy', 'test']
const expectedToolsScriptKeys:string[] = ['bundler', 'tester', 'transpiler']
const expectedTaskScriptNames:string[] = ['build.development', 'build.production', 'deploy', 'test']
const expectedToolScriptNames:string[] = ['bundler', 'tester.quiet', 'tester.verbose', 'transpiler']

function getTestProjectNPSScripts(project:string):NPSScripts
{
  const directoryPath:string = resolve(rootDirectoryPath, `test-projects/${project}`)

  process.chdir(directoryPath)

  const scripts:NPSScripts = getNPSScripts()

  process.chdir(rootDirectoryPath)

  return scripts
}

function getTestProjectNPSScriptNames(project:string):string[]
{
  const directoryPath:string = resolve(rootDirectoryPath, `test-projects/${project}`)

  process.chdir(directoryPath)

  const scriptNames:string[] = getNPSScriptNames()

  process.chdir(rootDirectoryPath)

  return scriptNames
}

test('Gets NPS scripts', ():void =>
{
  let scripts:NPSScripts

  scripts = getTestProjectNPSScripts('empty')
  expect(scripts).toEqual({})

  scripts = getTestProjectNPSScripts('empty-run')
  expect(scripts).toEqual({})

  scripts = getTestProjectNPSScripts('only-tasks')
  expect(Object.keys(scripts).sort()).toEqual(expectedTaskScriptKeys)

  scripts = getTestProjectNPSScripts('only-tools')
  expect(Object.keys(scripts).sort()).toEqual(expectedToolsScriptKeys)

  scripts = getTestProjectNPSScripts('tasks-and-tools')
  expect(Object.keys(scripts).sort()).toEqual(expectedTaskScriptKeys.concat(expectedToolsScriptKeys).sort())
})

test('Gets NPS script names', ():void =>
{
  let scriptNames:string[]

  scriptNames = getTestProjectNPSScriptNames('empty')
  expect(scriptNames).toEqual([])

  scriptNames = getTestProjectNPSScriptNames('empty-run')
  expect(scriptNames).toEqual([])

  scriptNames = getTestProjectNPSScriptNames('only-tasks')
  expect(scriptNames.sort()).toEqual(expectedTaskScriptNames)

  scriptNames = getTestProjectNPSScriptNames('only-tools')
  expect(scriptNames.sort()).toEqual(expectedToolScriptNames)

  scriptNames = getTestProjectNPSScriptNames('tasks-and-tools')
  expect(scriptNames.sort()).toEqual(expectedTaskScriptNames.concat(expectedToolScriptNames).sort())
})

test('Runs NPS scripts', ():void =>
{
  let directoryPath:string

  expect(() => runNPSScripts([])).toThrow(Message.NPS.ScriptKeysRequired)

  directoryPath = resolve(rootDirectoryPath, 'test-projects/empty')
  process.chdir(directoryPath)
  expect(() => runNPSScripts(['build'])).toThrow(Message.NPS.ScriptsNotDefined)
  process.chdir(rootDirectoryPath)

  directoryPath = resolve(rootDirectoryPath, 'test-projects/empty-run')
  process.chdir(directoryPath)
  expect(() => runNPSScripts(['build'])).toThrow(Message.NPS.ScriptsNotDefined)
  process.chdir(rootDirectoryPath)

  directoryPath = resolve(rootDirectoryPath, 'test-projects/only-tasks')
  process.chdir(directoryPath)
  expect(() => runNPSScripts(['build'])).toThrow(`NPS script ${bold('build')} could not be resolved`)
  expect(() => runNPSScripts(['build', 'test'])).toThrow(`NPS script ${bold('build')} could not be resolved`)
  expect(() => runNPSScripts(['build', 'bundler'])).toThrow(`NPS scripts ${bold('build')} and ${bold('bundler')} could not be resolved`)
  expect(() => runNPSScripts(['build.development'])).not.toThrow()
  expect(() => runNPSScripts(['test', 'build.production', 'deploy'])).not.toThrow()
  process.chdir(rootDirectoryPath)

  directoryPath = resolve(rootDirectoryPath, 'test-projects/only-tools')
  process.chdir(directoryPath)
  expect(() => runNPSScripts(['build.development'])).toThrow(`NPS script ${bold('build.development')} could not be resolved`)
  expect(() => runNPSScripts(['build.development', 'bundler'])).toThrow(`NPS script ${bold('build.development')} could not be resolved`)
  expect(() => runNPSScripts(['tester'])).toThrow(`NPS script ${bold('tester')} could not be resolved`)
  expect(() => runNPSScripts(['tester.quiet'])).not.toThrow()
  expect(() => runNPSScripts(['tester.quiet', 'transpiler', 'bundler'])).not.toThrow()
  process.chdir(rootDirectoryPath)

  directoryPath = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  process.chdir(directoryPath)
  expect(() => runNPSScripts(['test', 'build.production', 'deploy'])).not.toThrow()
  expect(() => runNPSScripts(['tester.quiet', 'transpiler', 'bundler'])).not.toThrow()
  process.chdir(rootDirectoryPath)
})
