/* eslint no-use-before-define: off */
import type { ParsedArgs } from 'minimist'

export interface RunnableArgumentDefinition {
  alias?: string
  description?: string
  type?: 'boolean' | 'string'
}

export interface RunnableArgumentDefinitions {
  [name: string]: RunnableArgumentDefinition
}

export type Runnable = string | RunnableFunction

export type RunnableFunction = (args?: ParsedArgs) => Runnable | RunnableSequence | undefined

export type RunnableSequence = Array<Runnable | RunnableSequence>
