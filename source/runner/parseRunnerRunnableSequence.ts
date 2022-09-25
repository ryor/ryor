import type { RunnableSequence } from '../runnables'

export function parseRunnerRunnableSequence(argv: string[]): RunnableSequence {
  let sequence: RunnableSequence = []

  if (argv.length > 0) {
    sequence = argv
      .reduce(
        (definitions: string[][], value: string): string[][] => {
          if (value === '+') definitions.push([])
          else definitions[definitions.length - 1]?.push(value)

          return definitions
        },
        [[]]
      )
      .filter((definition: string[]): boolean => definition.length > 0)
      .map((array: string[]): string => array.join(' '))
  }

  return sequence
}
