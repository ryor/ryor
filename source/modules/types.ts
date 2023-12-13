/* eslint no-use-before-define: off */
import { Runnable, RunnableArgumentDefinitions, RunnableSequence } from '../runnables'

export type RunnableModule = NodeModule & {
  args?: RunnableArgumentDefinitions
  commands?: RunnableModuleCommandDefinitions
  description?: string | (() => string)
  run: Runnable | RunnableSequence
  usage?: RunnableModuleUsage | (() => RunnableModuleUsage)
}

export type RunnableModuleUsage = RunnableModuleUsageDefinition | string

export interface RunnableModuleUsageDefinition {
  args?: string
  body?: string
}

export interface RunnableModuleCommandDefinition {
  args?: RunnableArgumentDefinitions
  description: string
}

export interface RunnableModuleCommandDefinitions {
  [name: string]: RunnableModuleCommandDefinition
}
