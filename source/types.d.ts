declare module 'cross-spawn' {
  export function spawn(command:string, args?:string[], options?:{}):NodeJS.EventEmitter
}

declare module 'shell-quote' {
  export function parse(args:string):string[]
}

type RunnableDefinition = string | string[]

type RunnableFunction = (args?:string[]) => RunnableDefinition | void | Promise<RunnableDefinition | void>

interface RunnableModule {
  description?: string
  run: RunnableDefinition | RunnableFunction | Runnable
}

interface Runnable
{
  command?: string
  function?: RunnableFunction
  args?: string[]
  context?: string
}
