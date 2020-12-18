/* eslint no-use-before-define: off */
import type { ParsedArgs } from 'minimist'

export type CommandLineInput = {
  args: string[]
  configuration: Configuration
}

export type Configuration = {
  entry: {
    directoryName: string,
    directoryPath: string
    sequence: string[]
  }
  outputRunDuration?: boolean
  usage?: UsageConfiguration
}

export type Runnable = string | RunnableFunction

export type RunnableArgumentDefinition = {
  alias?: string
  description?: string
  type?: 'boolean' | 'string'
}

export type RunnableArgumentDefinitions = {
  [name: string]: RunnableArgumentDefinition
}

export type RunnableFunction = (args?: ParsedArgs) => Runnable | RunnableSequence | undefined

export type RunnableModule = {
  args?: RunnableArgumentDefinitions
  description?: string | (() => string)
  run: Runnable | RunnableSequence
  usage?: Usage | (() => Usage)
}

export type RunnableSequence = (Runnable | RunnableSequence)[]

export type RunnablesDirectory = {
  name: string,
  path: string
}

export type Usage = string | UsageInformation

export type UsageConfiguration = {
  types?: string[]
}

export type UsageInformation = {
  args?: string
  body?: string
}
