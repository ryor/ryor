import chalk from 'chalk'
import {EOL} from 'os'
import {capitalize, maxStringLength, padStringWithSpaces} from '../strings'

export const DEFAULT_LIST_ITEM_DESCRIPTION:string = 'No description provided'

export function composeUsageInformationList(items:Map<string, string|undefined>, type?:string, maxNameLength?:number):string
{
  const lines:string[] = type !== undefined && type !== '' ? [`${chalk.bold(`${capitalize(type)}:`)}${EOL}`] : []
  const indent:string = type !== undefined && type !== '' ? '  ' : ''

  if (maxNameLength === undefined)
    maxNameLength = maxStringLength(Array.from(items.keys()))

  items.forEach((description:string|undefined, name:string):number => lines.push(
    `${indent}${chalk.bold(padStringWithSpaces(name, maxNameLength!))}    ${description !== undefined ? description : DEFAULT_LIST_ITEM_DESCRIPTION}`
  ))

  return lines.join(`${EOL}`)
}
