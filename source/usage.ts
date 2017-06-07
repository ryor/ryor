import {bold} from 'chalk'
import {EOL} from 'os'
import {getRunnables} from './runnables'
import {Message, capitalize, maxStringLength, padStringWithSpaces} from './strings'

export function composeItemsList(label:string, items:Map<string, string>):string
{
  const maxKeyLength:number = maxStringLength(Array.from(items.keys()))
  const lines:string[] = []

  items.forEach((value:string, key:string) => lines.push(`${bold(padStringWithSpaces(key, maxKeyLength))}    ${value}`))

  return `${bold(`${label}:`)}${EOL}${EOL}  ${lines.join(`${EOL}  `)}`
}

export function composeUsageInformation(type:string):string
{
  const runnables:Map<string, Runnable> = getRunnables(type)
  const items:Map<string, string> = new Map<string, string>()

  runnables.forEach(({description}, key):Map<string, string> => items.set(key, description || Message.Usage.NoDescriptionProvided))

  if (type === 'tasks'
  && getRunnables('tools').size > 0)
    items.set('tools', Message.Usage.ToolsTaskDescription)

  return [
    Message.Usage.Intructions.replace('[TYPE]', type),
    composeItemsList(capitalize(type), items)
  ].join(`${EOL}${EOL}`)
}

export function outputUsageInformation(type:string = 'tasks'):void
{
  console.log(`${EOL}${composeUsageInformation(type)}${EOL}`)
}
