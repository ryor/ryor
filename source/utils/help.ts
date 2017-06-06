import {bold} from 'chalk'
import {EOL} from 'os'
import {getRunnables} from './runnables'
import {capitalize, maxStringLength, padStringWithSpaces} from './strings'

export const Message:{[key:string]:string} = {
  NoDescriptionProvided: 'No description provided',
  Usage: `${bold('Usage:')} node run ${bold('<[TYPE]...>')}`,
  ToolsTaskDescription: 'Lists available tools'
}

export function composeHelpItemsList(label:string, items:Map<string, string>):string
{
  const maxKeyLength:number = maxStringLength(Array.from(items.keys()))
  const lines:string[] = []

  items.forEach((value:string, key:string) => lines.push(`${bold(padStringWithSpaces(key, maxKeyLength))}    ${value}`))

  return `${bold(`${label}:`)}${EOL}${EOL}  ${lines.join(`${EOL}  `)}`
}

export function composeHelpMessage(type:string):string
{
  const runnables:Map<string, Runnable> = getRunnables(type)!
  const items:Map<string, string> = new Map<string, string>()

  runnables.forEach(({description}, key):Map<string, string> => items.set(key, description || Message.NoDescriptionProvided))

  if (type === 'tasks')
    items.set('tools', Message.ToolsTaskDescription)

  return [
    Message.Usage.replace('[TYPE]', type),
    composeHelpItemsList(capitalize(type), items)
  ].join(`${EOL}${EOL}`)
}

export function outputHelpMessage(type:string = 'tasks'):void
{
  console.log(`${EOL}${composeHelpMessage(type)}${EOL}`)
}
