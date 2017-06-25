import {bold} from 'chalk'
import {parse} from 'shell-quote'
import {resolveRunnableModule} from './modules'

export function resolveOperation(definition:RunnableDefinition):RunnableDefinition|Runnable|(RunnableDefinition|Runnable)[]
{
  if (typeof definition === 'string')
    definition = parse(definition)

  const runnableName:string = definition[0] as string
  const runnableModule:RunnableModule|undefined = resolveRunnableModule(runnableName)

  if (runnableModule)
  {
    const {run} = runnableModule

    if (typeof run === 'function')
      return {function:run, args:definition.slice(1)} as Runnable

    else if (typeof run === 'string')
    {
      definition = parse(run)

      return {command:definition[0], args:definition.slice(1)}
    }

    else if (Array.isArray(run))
      return (run as (string|string[])[]).map((definition:string|string[]):RunnableDefinition|Runnable =>
      {
        if (typeof definition === 'string')
        {
          definition = parse(definition)

          if (definition[0] === runnableName)
            return {command:runnableName, args:definition.slice(1)}

          return definition
        }

        return [definition]
      })

    else
      throw new Error(`Runnable module ${bold(runnableName)} returned unexpected ${bold('run')} type. Expected string, array or function; received ${bold(typeof run)}.`)
  }

  else
    return {command:runnableName, args:definition.slice(1)} as Runnable
}
