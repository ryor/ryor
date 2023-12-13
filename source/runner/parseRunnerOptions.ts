import minimist from 'minimist'
import { DEBUG_OPTION_FLAG, HELP_OPTION_FLAG, RUN_TIME_OPTION_FLAG } from './constants'
import { RunnerOptions } from './types'

export function parseRunnerOptions(flags: string[]) {
  const options: RunnerOptions = {}

  if (flags.length > 0) {
    const minimistOpts = {
      alias: {
        [DEBUG_OPTION_FLAG.charAt(0)]: DEBUG_OPTION_FLAG,
        [HELP_OPTION_FLAG.charAt(0)]: HELP_OPTION_FLAG,
        [RUN_TIME_OPTION_FLAG.charAt(0)]: RUN_TIME_OPTION_FLAG
      },
      boolean: [DEBUG_OPTION_FLAG, HELP_OPTION_FLAG, RUN_TIME_OPTION_FLAG]
    }
    const parsedArgs = minimist(flags, minimistOpts)

    minimistOpts.boolean.forEach((key) => {
      if (parsedArgs[key] === true) {
        if (key === DEBUG_OPTION_FLAG) options.debug = true
        if (key === HELP_OPTION_FLAG) options.help = true
        if (key === RUN_TIME_OPTION_FLAG) options.time = true
      }
    })
  }

  return options
}
