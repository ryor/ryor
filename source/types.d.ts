/* eslint no-use-before-define: off */
import type { ParsedArgs } from 'minimist'

export interface CommandLineInput {
  args: string[]
  configuration: Configuration
}

export interface Configuration {
  entry: {
    directoryName: string
    directoryPath: string
    sequence: string[]
  }
  outputRunDuration?: boolean
  usage?: UsageConfiguration
}

export type Runnable = string | RunnableFunction

export interface RunnableArgumentDefinition {
  alias?: string
  description?: string
  type?: 'boolean' | 'string'
}

export interface RunnableArgumentDefinitions {
  [name: string]: RunnableArgumentDefinition
}

export type RunnableFunction = (args?: ParsedArgs) => Runnable | RunnableSequence | undefined

export type RunnableModule = NodeModule & {
  args?: RunnableArgumentDefinitions
  description?: string | (() => string)
  run: Runnable | RunnableSequence
  usage?: Usage | (() => Usage)
}

export type RunnableSequence = Array<Runnable | RunnableSequence>

export interface RunnablesDirectory {
  name: string
  path: string
}

export type Usage = string | UsageInformation

export interface UsageConfiguration {
  categories?: string[]
}

export interface UsageInformation {
  args?: string
  body?: string
}
