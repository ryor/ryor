export type EntryRunnableModulesList = (string | [string, string[]])[]

export interface RunnerConfiguration {
  directory: string
  modules: RunnableModulesList
  options?: RunnerOptions
}

export interface RunnerOptions {
  debug?: boolean
  help?: boolean
  time?: boolean
}

export type RunnableModulesList = [name: string, category?: string][]
