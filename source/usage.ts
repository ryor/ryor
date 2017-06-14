import {bold} from 'chalk'
import {EOL} from 'os'
import {maxStringLength, padStringWithSpaces} from './strings'

export function composeUsageInformation(args:string[], runnableModules:Map<string, Map<string, RunnableModule>>):string
{
  const type:string = args.length > 0 && args[0] === 'tools' ? (runnableModules.has('tools') ? 'tools' : 'tasks') : runnableModules.has('tasks') ? 'tasks' : 'tools'
  const modules:Map<string, RunnableModule> = runnableModules.get(type)!
  const descriptions:Map<string, string> = Array.from(modules.keys()).
    reduce((map:Map<string, string>, key:string):Map<string, string> =>
      map.set(key, modules.get(key)!.description || 'No description provided'),
      new Map<string, string>()
    )

  if (type === 'tasks' && runnableModules.has('tools'))
    descriptions.set('tools', 'Lists available tools')

  const keys:string[] = Array.from(descriptions.keys())
  const maxKeyLength:number = maxStringLength(keys)
  const usageTypes:string = `${runnableModules.has('tasks') ? 'task|' : ''}${runnableModules.has('tools') ? 'tool|' : ''}command`
  const usage:string = `${bold('Usage:')} node run ${bold(`<${usageTypes}>`)} [args...] [+ <${usageTypes}> [args...]] ...`
  const label:string = bold(`${type.charAt(0).toUpperCase()}${type.slice(1)}:`)
  const runnables:string = `${keys.map((key:string):string => `  ${bold(padStringWithSpaces(key, maxKeyLength))}    ${descriptions.get(key)}`).join(EOL)}`

  return `${usage}${EOL}${EOL}${label}${EOL}${EOL}${runnables}`
}
