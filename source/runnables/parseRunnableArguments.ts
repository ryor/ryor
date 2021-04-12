import minimist, { Opts, ParsedArgs } from 'minimist'
import type { RunnableArgumentDefinitions } from './types'

export function parseRunnableArguments (definitions: RunnableArgumentDefinitions, args: string[]): ParsedArgs {
  return minimist(
    args,
    Object
      .entries(definitions)
      .reduce((opts: Opts, [name, definition]): Opts => {
        if (definition.alias !== undefined) {
          opts.alias = {
            [definition.alias]: name,
            ...(opts.alias ?? {})
          }
        }

        if (definition.type === 'boolean') {
          opts.boolean = [
            name,
            ...(opts.boolean as string[] ?? [])
          ]
        } else if (definition.type === 'string') {
          opts.string = [
            name,
            ...(opts.string ?? [])
          ]
        }

        return opts
      }, {})
  )
}
