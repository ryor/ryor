import minimist, { Opts, ParsedArgs } from 'minimist'
import { DEBUG_OPTION_FLAG, RUN_TIME_OPTION_FLAG } from './constants'
import type { RunnerOptions } from './types'

export function parseRunnerOptions (flags: string[]): RunnerOptions {
  const options: RunnerOptions = {}

  if (flags.length > 0) {
    const minimistOpts: Opts = {
      alias: {
        [DEBUG_OPTION_FLAG.charAt(0)]: DEBUG_OPTION_FLAG,
        [RUN_TIME_OPTION_FLAG.charAt(0)]: RUN_TIME_OPTION_FLAG
      },
      boolean: [DEBUG_OPTION_FLAG, RUN_TIME_OPTION_FLAG]
    }
    const parsedArgs: ParsedArgs = minimist(flags, minimistOpts);

    (minimistOpts.boolean as string[]).forEach((key: string): void => {
      if (parsedArgs[key] === true) {
        if (key === DEBUG_OPTION_FLAG) options.debug = true
        if (key === RUN_TIME_OPTION_FLAG) options.time = true
      }
    })
  }

  return options
}
