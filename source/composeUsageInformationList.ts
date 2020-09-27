import { bold } from 'chalk'
import { EOL } from 'os'
import { composeUsageInformationListItem } from './composeUsageInformationListItem'

export function composeUsageInformationList (items:Map<string, string|undefined> = new Map(), type?:string, minNameLength:number = 0):string {
  const lines:string[] = type ? [`${bold(`${type.charAt(0).toUpperCase() + type.slice(1)}:`)}${EOL}`] : []
  const indent:string = type ? '  ' : ''

  items.forEach((_, name:string):void => { minNameLength = name.length > minNameLength ? name.length : minNameLength })

  items.forEach((description:string|undefined, name:string):number => lines.push(composeUsageInformationListItem(name, description, indent, minNameLength)))

  return lines.join(EOL)
}
