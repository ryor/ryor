import { parseRunnerOptions, parseRunnerRunnableSequence, RunnerOptions } from '../runner'

export function parseConsoleInput(argv: string[]) {
  let options: RunnerOptions = {}

  if (argv.length > 0) {
    const flags: string[] = []

    while (argv.length > 0 && argv[0].charAt(0) === '-') flags.push(argv.shift() as string)

    if (flags.length > 0) options = parseRunnerOptions(flags)
  }

  const sequence = parseRunnerRunnableSequence(argv)

  return { options, sequence }
}
