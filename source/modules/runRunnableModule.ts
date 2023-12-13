import { ParsedArgs } from 'minimist'
import { Runnable, RunnableSequence, isValidRunnable, isValidRunnableSequence, parseRunnableArguments, runRunnable, runRunnableSequence } from '../runnables'
import { RunnerConfiguration } from '../runner'
import { outputUsageInformation } from '../usage'
import { RunnableModuleError } from './RunnableModuleError'
import { ensureRunnableModuleHelpArgumentDefinition } from './ensureRunnableModuleHelpArgumentDefinition'
import { RunnableModule } from './types'

export async function runRunnableModule(module: RunnableModule, name: string, args: string[], configuration: RunnerConfiguration) {
  try {
    const initialRunnable = module.run
    let nextRunnable: Runnable | RunnableSequence | undefined

    if (typeof initialRunnable === 'function') {
      if (module.commands !== undefined) {
        if (args.length === 0 || module.commands[args[0]] === undefined) await outputUsageInformation(configuration, name)
        else {
          const runnableArgumentDefinitions = ensureRunnableModuleHelpArgumentDefinition(module.commands[args[0]].args)
          const runnableArguments: ParsedArgs = parseRunnableArguments(runnableArgumentDefinitions, args.slice(1))

          if (runnableArguments.help === true) await outputUsageInformation(configuration, name)
          else nextRunnable = await initialRunnable({ command: args[0], ...runnableArguments })
        }
      } else {
        const runnableArgumentDefinitions = ensureRunnableModuleHelpArgumentDefinition(module.args)
        const runnableArguments = parseRunnableArguments(runnableArgumentDefinitions, args)

        if (runnableArguments.help === true) await outputUsageInformation(configuration, name)
        else nextRunnable = await initialRunnable(runnableArguments)
      }

      while (typeof nextRunnable === 'function') nextRunnable = await nextRunnable()
    } else nextRunnable = initialRunnable

    if (nextRunnable !== undefined) {
      if (Array.isArray(nextRunnable)) {
        if (isValidRunnableSequence(nextRunnable)) await runRunnableSequence(nextRunnable, configuration, name)
      } else if (isValidRunnable(nextRunnable)) await runRunnable(nextRunnable, configuration, name)
    }
  } catch ({ message, stack }) {
    const error = new RunnableModuleError(message)

    error.stack = stack

    throw error
  }
}
