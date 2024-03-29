import chalk from 'chalk'
import { LINE_BREAK } from '../shared'
import { INDENT } from './constants'
import { RunnableArgumentDefinitions } from '../runnables'

export function composeRunnableArgumentsInformation(args: RunnableArgumentDefinitions, indent = '') {
  let maxOptionsLength = 0

  return Object.keys(args)
    .sort((a: string, b: string) => a.localeCompare(b))
    .map((key: string) => {
      const short: string = args[key]?.alias !== undefined ? `-${args[key]?.alias as string}` : ''
      const long = `--${key}`
      const description: string = args[key]?.description ?? ''
      const optionsLength: number = `${short}${INDENT}${long}`.length

      if (optionsLength > maxOptionsLength) maxOptionsLength = optionsLength

      return [short, long, description]
    })
    .map(([short, long, description]: string[]) => {
      const optionsString = `${short}${INDENT}${long}`

      return `${indent}${chalk.bold(optionsString)}${' '.repeat(maxOptionsLength - optionsString.length)}${description !== '' ? `${INDENT + description}` : ''}`
    })
    .join(LINE_BREAK)
}
