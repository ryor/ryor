import {bold} from 'chalk'
import {existsSync, readdirSync} from 'fs'
import {parse, resolve} from 'path'
import * as minimist from 'minimist'
import {outputHelpMessage} from './help'
import {getNPSScriptDescription, runNPSScripts} from './nps'
import {commaSeparateValues, fail} from './utils'
import {
  COMMAND_NOT_FOUND,
  COMMAND_DEFINITION_NOT_FOUND,
  COMMAND_VALUES_COUNT_TOO_HIGH,
  COMMAND_VALUES_COUNT_TOO_LOW,
  COMMAND_VALUES_INVALID,
  COMMAND_VALUES_KEY_MISSING,
  NO_DESCRIPTION_PROVIDED
} from './messages'

export function getCommandDirectoryPaths():string[]
{
  const paths:string[] = [resolve(__dirname, 'commands')]
  const projectCommandsDirectoryPath = resolve(process.cwd(), 'run/commands')

  if (existsSync(projectCommandsDirectoryPath)
  && readdirSync(projectCommandsDirectoryPath).length > 0)
    paths.push(projectCommandsDirectoryPath)

  return paths
}

export function getCommandPaths():{[key:string]:string}
{
  return getCommandDirectoryPaths()
    .reduce((result:{[key:string]:string}, directoryPath:string):{[key:string]:string} => Object.assign(result, readdirSync(directoryPath)
      .reduce((paths:{[key:string]:string}, filePath:string) => (paths[parse(filePath).name] = resolve(directoryPath, filePath)) && paths, {})), {})
}

export function getCommandNames():string[]
 {
  const bottomValues:string[] = ['nps', 'help']

  return Object.keys(getCommandPaths())
    .filter((name:string):boolean => !bottomValues.includes(name))
    .concat(bottomValues)
}

export function getCommandPath(commandName:string):string
{
  const commandPaths:{[key:string]:string} = getCommandPaths()

  if (!commandPaths[commandName])
    fail(COMMAND_NOT_FOUND.replace('[COMMAND_NAME]', commandName))

  return require.resolve(commandPaths[commandName])
}

export function getCommandDefinition(commandName:string):CommandDefinition
{
  const commandPath:string = getCommandPath(commandName)
  const {define}:CommandModule = require(commandPath)

  if (!define)
    fail(COMMAND_DEFINITION_NOT_FOUND.replace('[COMMAND_PATH]', commandPath))

  return define!()
}

export function getCommandDescription(commandName:string):string
{
  const commandPath:string = getCommandPath(commandName)
  const {define, nps}:CommandModule = require(commandPath)
  let description:string|undefined

  if (define)
    description = define().description

  else if (nps)
    description = getNPSScriptDescription(nps)

  return description || NO_DESCRIPTION_PROVIDED
}

export function convertOptionsToMinimistOpts(options:CommandOptions):minimist.Opts
{
  const minimistOpts:minimist.Opts = {alias:{}, boolean:[], string:[]}

  Object.keys(options).forEach((key:string):void =>
  {
    const {alias, type}:CommandOption = options[key]

    minimistOpts.alias![alias] = key

    if (type === 'boolean')
      (minimistOpts.boolean as string[]).push(key)

    else
      (minimistOpts.string as string[]).push(key)
  })

  return minimistOpts
}

export function getCommandOptions(commandName:string):CommandOptions
{
  const optionDefinitions:CommandOptionDefinitions|undefined = getCommandDefinition(commandName).options

  if (!optionDefinitions)
    return {}

  return Object.keys(optionDefinitions).reduce((result:CommandOptions, key:string):CommandOptions =>
  {
    const definition:string|CommandOptionDefinition = optionDefinitions[key]
    let alias:string = key.charAt(0)
    let description:string = NO_DESCRIPTION_PROVIDED
    let type:string = 'boolean'

    if (typeof definition === 'string')
      description = definition

    else if (typeof definition === 'object')
    {
      if (definition.alias)
        alias = definition.alias

      if (definition.description)
        description = definition.description

      if (definition.type && definition.type === 'string')
        type === 'string'
    }

    result[key] = {alias, description, type}

    return result
  }, {})
}

export function resolveCommandValues(commandName:string, input:string[]):{[key:string]:string|string[]}
{
  const valuesDefinition:CommandValuesDefinition|undefined = getCommandDefinition(commandName).values

  if (!valuesDefinition
  || Object.keys(valuesDefinition).length === 0)
    return {}

  const {accepts, defaults, key, limit, required} = valuesDefinition

  if (!key)
    fail(COMMAND_VALUES_KEY_MISSING.replace('[COMMAND_PATH]', getCommandPath(commandName)))

  if (required && input.length < required)
  {
    const message:string = COMMAND_VALUES_COUNT_TOO_LOW
      .replace('[COMMAND_NAME]', commandName)
      .replace('[REQUIRED]', required === 1 ? 'a' : required)
      .replace('[TYPE]', `value${required === 1 ? '' : 's'}`)
      .replace('[KEY]', key)
      .replace('[RECEIVED]', input.length > 0 ? ` Received only ${commaSeparateValues(input.map(value => `"${bold(value)}"`))}.` : '')

    fail(message)
  }

  if (limit && input.length > limit)
  {
    const message:string = COMMAND_VALUES_COUNT_TOO_HIGH
      .replace('[COMMAND_NAME]', commandName)
      .replace('[LIMIT]', limit.toString())
      .replace('[TYPE]', `value${required === 1 ? '' : 's'}`)
      .replace('[KEY]', key)
      .replace('[RECEIVED]', input.length > 0 ? ` Received ${commaSeparateValues(input.map(value => `"${bold(value)}"`))}.` : '')

    fail(message)
  }

  if (accepts
  && ((input.length === 1 && !accepts[input[0]])
  || (input.length > 1 && !input.every((value:string):boolean => !!accepts[value]))))
  {
    const message:string = COMMAND_VALUES_INVALID
      .replace('[COMMAND_NAME]', commandName)
      .replace('[KEY]', key)
      .replace('[VALUES]', commaSeparateValues(Object.keys(accepts).map((key:string):string => `${bold(key)}`)))
      .replace('[RECEIVED]', commaSeparateValues(input.map((value:string):string => `"${bold(value)}"`)))

    fail(message)
  }

  const result:{[key:string]:string|string[]} = {}

  if (input.length === 0)
  {
    if (defaults)
      result[key] = defaults
  }

  else if (input.length === 1 && (!limit || limit === 1))
    result[key] = input[0]

  else
    result[key] = input

  return result
}

export function run():void
{
  const args:string[] = process.argv.slice(2)

  if (args.length > 0
  && getCommandNames().includes(args[0]))
  {
    const commandName:string = args[0]
    const commandPath:string = getCommandPath(commandName)
    const {nps, run}:CommandModule = require(commandPath)

    if (nps)
      return runNPSScripts([nps])

    if (run)
    {
      let commandArgs:{[key:string]:string} = {}

      if (args.length > 1)
      {
        const options:CommandOptions = getCommandOptions(commandName)
        const minimistOpts:minimist.Opts = convertOptionsToMinimistOpts(options)
        const minimistFunction:(input:string[], opts:minimist.Opts) => minimist.ParsedArgs = minimist // Workaround for Rollup "Cannot call a namespace" issue (https://github.com/rollup/rollup/issues/670)
        const parsedArgs:minimist.ParsedArgs = minimistFunction(args.slice(1), minimistOpts)

        Object.keys(parsedArgs).forEach((key:string):void =>
        {
          if (key.length > 1)
            commandArgs[key] = parsedArgs[key]
        })

        Object.assign(commandArgs, resolveCommandValues(commandName, parsedArgs._))
      }

      return run(commandArgs)
    }
  }

  outputHelpMessage()
}
