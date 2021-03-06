import { bold } from 'chalk'
import { LINE_BREAK } from '../shared'
import { INDENT } from './constants'
import type { RunnableArgumentDefinitions } from '../runnables'

export function composeRunnableArgumentsInformation (args: RunnableArgumentDefinitions, indent: string = ''): string {
  let maxOptionsLength: number = 0

  return Object.keys(args)
    .sort((a: string, b: string): number => a.localeCompare(b))
    .map((key: string): string[] => {
      const short: string = args[key]?.alias !== undefined ? `-${args[key]?.alias as string}` : ''
      const long: string = `--${key}`
      const description: string = args[key]?.description ?? ''
      const optionsLength: number = `${short}${INDENT}${long}`.length

      if (optionsLength > maxOptionsLength) maxOptionsLength = optionsLength

      return [short, long, description]
    })
    .map(([short, long, description]: string[]): string => {
      const optionsString: string = `${short}${INDENT}${long}`

      return `${indent}${bold(optionsString)}${' '.repeat(maxOptionsLength - optionsString.length)}${description !== '' ? `${INDENT + description}` : ''}`
    })
    .join(LINE_BREAK)
}
