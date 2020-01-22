import chalk from 'chalk'
import minimist from 'minimist'
import { parse } from 'shell-quote'
import { CommandRunnable } from '../classes/CommandRunnable'
import { FunctionRunnable } from '../classes/FunctionRunnable'
import { Runner } from '../classes/Runner'
import { resolveRunnableModule } from './modules'

export function isValidRunnableScript (script:RunnableScript):boolean {
  return (typeof script === 'string' && script !== '') || (Array.isArray(script) && script.length > 0)
}

export function parseRunnableScript (script:RunnableScript|string):CommandRunnable|RunnableScript {
  if (typeof script === 'string') { script = parse(script) as string[] }

  if ((script[0]).startsWith('-')) {
    const flags:string[] = []

    if (script.length > 0) {
      while ((script[0]).charAt(0) === '-') { flags.push((script as string[]).shift()!) }
    }

    const parsedFlags:minimist.ParsedArgs = minimist(flags, { alias: { c: 'command' }, boolean: ['c', 'command'] })

    if (parsedFlags.command === true) { return new CommandRunnable(script[0], (script as string[]).slice(1)) }
  }

  return script
}

export function resolveRunnableFromScript (script:RunnableScript, context?:string):Runnable {
  if (!isValidRunnableScript(script)) {
    throw new Error(`Invalid runnable definition${
      context !== undefined ? ` encountered in ${chalk.bold(context)} module` : ''
    }: ${
      chalk.bold(typeof script === 'string' ? script === '' ? 'empty string' : script : JSON.stringify(script))
    }`)
  }

  const parsedScript:CommandRunnable|RunnableScript = parseRunnableScript(script)

  if (parsedScript instanceof CommandRunnable) { return parsedScript }

  const strings:string[] = parsedScript as string[]
  const name:string = strings[0]
  const args:string[] = strings.slice(1)

  if (context !== undefined && name === context) { return new CommandRunnable(name, args) }

  const runnableModule:RunnableModule|undefined = resolveRunnableModule(name)

  if (runnableModule === undefined) { return new CommandRunnable(name, args) }

  const definition:RunnablesDefinition = runnableModule.run

  context = name

  if (definition instanceof CommandRunnable) { return definition }

  if (definition instanceof FunctionRunnable) {
    definition.context = context

    return definition
  }

  if (Array.isArray(definition)) { return new Runner(definition, context) }

  if (typeof definition === 'function') { return new FunctionRunnable(definition, args, context) }

  if (typeof definition === 'string') { return resolveRunnableFromScript(definition, context) }

  throw new Error(`Invalid runnable definition encountered in ${chalk.bold(context)} module: ${chalk.bold(JSON.stringify(definition))}`)
}
