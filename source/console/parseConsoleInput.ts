import { parseRunnerOptions, parseRunnerRunnableSequence } from '../runner'
import type { RunnableSequence } from '../runnables'
import type { RunnerOptions } from '../runner'

export function parseConsoleInput (argv: string[]): { options: RunnerOptions, sequence: RunnableSequence } {
  let options: RunnerOptions = {}

  if (argv.length > 0) {
    const flags: string[] = []

    while (argv.length > 0 && argv[0].charAt(0) === '-') flags.push(argv.shift() as string)

    if (flags.length > 0) options = parseRunnerOptions(flags)
  }

  const sequence: RunnableSequence = parseRunnerRunnableSequence(argv)

  return { options, sequence }
}
