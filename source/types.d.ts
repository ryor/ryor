/* eslint no-use-before-define: off */

export type Configuration = { usage?: UsageConfiguration }

export type Runnable = string | RunnableFunction

export type RunnableFunction = (args?:string[]) => Runnable | RunnableSequence | undefined

export type RunnableModule = {
  description?: string | (() => string)
  usage?: Usage | (() => Usage)
  run: Runnable | RunnableSequence
}

export type RunnableSequence = (Runnable | RunnableSequence)[]

export type Usage = string | UsageInformation

export type UsageConfiguration = { types?: { order?: string[] } }

export type UsageInformation = {
  args?: string
  body?: string
}
