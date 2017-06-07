import {bold, underline} from 'chalk'

export const Message:{[key:string]:{[key:string]:string}} = {
  NPS: {
    ScriptKeysRequired: 'At least one script key required',
    ScriptsNotDefined: 'No NPS scripts found',
    ScriptsNotResolved: 'NPS scripts [SCRIPTS] could not be resolved'
  },
  Run: {
    RunnablesRequired: `Define ${bold('tasks')} or ${bold('tools')} to proceed. Visit ${underline('https://github.com/movecodemove/ryor')} for more details about how to get started.`
  },
  Usage: {
    Intructions: `${bold('Usage:')} node run ${bold('<[TYPE]...>')}`,
    NoDescriptionProvided: 'No description provided',
    ToolsTaskDescription: 'Lists available tools'
  }
}

export function capitalize(value:string):string
{
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

export function commaSeparateValues(values:string[]):string
{
  return values.join(', ').replace(/,(?=[^,]*$)/, ' and')
}

export function maxStringLength(strings:string[]):number
{
  return strings.reduce((maxLength:number, string:string):number => string.length > maxLength ? string.length : maxLength, 0)
}

export function padStringWithSpaces(string:string, minLength:number):string
{
  while (string.length < minLength)
    string += ' '

  return string
}
