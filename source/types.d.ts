declare module 'cross-spawn' {
  export function spawn(command:string, args?:string[], options?:{}):NodeJS.EventEmitter
}

declare module 'shell-quote' {
  export function parse(args:string):string[]
}

type RunnableDefinition = string | string[] | string[][]

interface RunnableModule {
  description?: string
  run: RunnableDefinition | RunnableFunction
}

interface RunnableFunction {
  (args?:string[]): Promise<string | string[] | string[][] | void> | string | string[] | string[][] | void
}

interface Runnable {
  command?: string
  function?: RunnableFunction
  args: string[]
}
