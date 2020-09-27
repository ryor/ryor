import { bold } from 'chalk'

const DEFAULT_DESCRIPTION:string = 'No description provided'

export function composeUsageInformationListItem (name:string, description?:string, indent:string = '', minNameLength:number = 0):string {
  return `${indent}${bold(name)}${name.length < minNameLength ? ' '.repeat(minNameLength - name.length) : ''}    ${description || DEFAULT_DESCRIPTION}`
}
