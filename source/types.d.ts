declare module 'cross-spawn' {
  export function spawn(command:string, args?:string[], options?:{}):NodeJS.EventEmitter
}

declare module 'shell-quote' {
  export function parse(args:string):string[]
}

declare type RunnableDefinition = string | string[] | string[][]

interface RunnableModule {
  description?: string
  run: RunnableDefinition | RunnableFunction
}

interface RunnableFunction {
  (args?:string[]): Promise<RunnableDefinition | void> | RunnableDefinition | void
}

interface Runnable {
  command?: string
  function?: RunnableFunction
  args: string[]
}
