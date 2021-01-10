import { bold } from 'chalk'
import { EOL } from 'os'

const DEFAULT_DESCRIPTION: string = 'No description provided'

export function composeUsageInformationList (items: Map<string, string | undefined> = new Map(), type?: string, minNameLength: number = 0): string {
  const lines: string[] = type !== undefined ? [`${bold(`${type.charAt(0).toUpperCase() + type.slice(1)}:`)}${EOL}`] : []
  const indent: string = type !== undefined ? '  ' : ''

  items.forEach((_, name: string): void => { minNameLength = name.length > minNameLength ? name.length : minNameLength })

  items.forEach((description: string | undefined, name: string): void => {
    lines.push(`${indent}${bold(name)}${name.length < minNameLength ? ' '.repeat(minNameLength - name.length) : ''}    ${description ?? DEFAULT_DESCRIPTION}`)
  })

  return lines.join(EOL)
}
