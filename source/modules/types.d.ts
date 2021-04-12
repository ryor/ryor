/* eslint no-use-before-define: off */
import { Runnable, RunnableArgumentDefinitions, RunnableSequence } from '../runnables'
import { Usage } from '../usage'

export type RunnableModule = NodeModule & {
  args?: RunnableArgumentDefinitions
  commands?: RunnableModuleCommandDefinitions
  description?: string | (() => string)
  run: Runnable | RunnableSequence
  usage?: Usage | (() => Usage)
}

export interface RunnableModuleCommandDefinition {
  args?: RunnableArgumentDefinitions
  description: string
}

export interface RunnableModuleCommandDefinitions {
  [ name: string ]: RunnableModuleCommandDefinition
}
