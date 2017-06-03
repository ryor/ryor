import {red} from 'chalk'
import {EOL} from 'os'

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

export function fail(message?:string):void
{
  if (message)
    console.error(`${EOL}${red(message)}${EOL}`)

  process.exit(1)
}
