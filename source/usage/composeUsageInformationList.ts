import chalk from 'chalk'
import { LINE_BREAK } from '../shared'
import { composeUsageInformationListItemName } from './composeUsageInformationListItemName'
import { DEFAULT_ITEM_DESCRIPTION } from './constants'

export function composeUsageInformationList (items: Map<string, string | undefined> = new Map(), type?: string, minNameLength: number = 0): string {
  const lines: string[] = type !== undefined ? [`${chalk.bold(`${composeUsageInformationListItemName(type)}:`)}${LINE_BREAK}`] : []
  const indent: string = type !== undefined ? '  ' : ''

  items.forEach((_, name: string): void => { minNameLength = name.length > minNameLength ? name.length : minNameLength })

  items.forEach((description: string | undefined, name: string): void => {
    lines.push(`${indent}${chalk.bold(name)}${name.length < minNameLength ? ' '.repeat(minNameLength - name.length) : ''}    ${description ?? DEFAULT_ITEM_DESCRIPTION}`)
  })

  return lines.join(LINE_BREAK)
}
