import {bold} from 'chalk'
import {parse} from 'shell-quote'
import {CommandRunnable} from '../classes/CommandRunnable'
import {FunctionRunnable} from '../classes/FunctionRunnable'
import {Runner} from '../classes/Runner'
import {resolveRunnableModule} from './modules'

export function resolveRunnable(definition:RunnablesDefinition, context?:string):Runnable
{
  if ((typeof definition === 'string' && definition !== '') || Array.isArray(definition))
  {
    if (typeof definition === 'string')
      definition = parse(definition)

    const name:string = definition[0] as string
    const args:string[] = definition.slice(1) as string[]

    if (context !== undefined && name === context)
      return new CommandRunnable(name, args)

    const runnableModule:RunnableModule|undefined = resolveRunnableModule(name)

    if (runnableModule === undefined)
      return new CommandRunnable(name, args)

    context = name
    definition = runnableModule.run

    if (definition instanceof CommandRunnable)
      return definition

    if (definition instanceof FunctionRunnable)
    {
      definition.context = context

      return definition
    }

    if (Array.isArray(definition))
      return new Runner(definition, context)

    if (typeof definition === 'function')
      return new FunctionRunnable(definition, args, context)

    if (typeof definition === 'string')
      return resolveRunnable(definition, context)
  }

  throw new Error(`${context === undefined
    ? 'Invalid definition passed to resolveRunnable function'
    : `Unexpected runnable definition encountered in ${bold(context)} module`}: ${
      bold(
        typeof definition === 'string'
          ? definition === ''
            ? 'empty string'
            : definition
          : JSON.stringify(definition)
      )
    }`)
}
