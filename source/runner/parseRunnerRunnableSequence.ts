import { RunnableSequence } from '../runnables'

export function parseRunnerRunnableSequence(argv: string[]) {
  let sequence: RunnableSequence = []

  if (argv.length > 0) {
    sequence = argv
      .reduce(
        (definitions: string[][], value: string) => {
          if (value === '+') definitions.push([])
          else definitions[definitions.length - 1]?.push(value)

          return definitions
        },
        [[]]
      )
      .filter((definition: string[]) => definition.length > 0)
      .map((array: string[]) => array.join(' '))
  }

  return sequence
}
