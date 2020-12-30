import { basename, dirname } from 'path'
import { isValidDirectoryPath } from './isValidDirectoryPath'
import type { Configuration, UsageConfiguration } from './types'

const SHORT_RUN_DURATION_FLAG: string = '-d'

const LONG_RUN_DURATION_FLAG: string = '--duration'

export async function configure (argv: string[], usage?: UsageConfiguration): Promise<Configuration> {
  const entryPath: string = argv[1]
  const directoryPath: string = (await isValidDirectoryPath(entryPath)) ? entryPath : dirname(entryPath)
  const directoryName = basename(directoryPath)
  const args: string[] = argv.slice(2)
  let outputRunDuration: boolean = false
  let sequence: string[]

  if (args.length > 0) {
    while ([SHORT_RUN_DURATION_FLAG, LONG_RUN_DURATION_FLAG].includes(args[0])) {
      args.shift()
      outputRunDuration = true
    }
  }

  if (args.length === 0 || args[0] === 'help') {
    sequence = ['help']

    if (args.length > 1) sequence.push(args[1])
  } else {
    sequence = args
      .reduce((definitions: string[][], value: string): string[][] => {
        if (value === '+') definitions.push([])

        else definitions[definitions.length - 1]?.push(value)

        return definitions
      }, [[]])
      .filter((definition: string[]): boolean => definition.length > 0)
      .map((array: string[]): string => array.join(' '))
  }

  const configuration: Configuration = {
    entry: {
      directoryName,
      directoryPath,
      sequence
    }
  }

  if (outputRunDuration) configuration.outputRunDuration = true

  if (usage !== undefined) configuration.usage = usage

  return configuration
}
