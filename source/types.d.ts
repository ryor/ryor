declare module 'cross-spawn' {
  export function spawn(command:string, args?:string[], options?:{}):NodeJS.EventEmitter
}

declare module 'shell-quote' {
  export function parse(args:string):string[]
}

interface Runnable {
  run():Promise<RunnablesDefinition|void>
}

interface RunnableModule {
  description?: string | DescriptionFactory
  usage?: Usage | UsageFactory
  run: RunnablesDefinition
}

interface UsageInformation {
  args?: string
  body?: string
}

type DescriptionFactory = () => string

type RunnableDefinition = Runnable | RunnableFunction | RunnableScript

type RunnablesDefinition = RunnableDefinition | RunnableDefinition[]

type RunnableFunction = (args?:string[]) => RunnablesDefinition | void | Promise<RunnablesDefinition | void>

type RunnableScript = string | string[]

type Usage = string | UsageInformation

type UsageFactory = () => Usage
