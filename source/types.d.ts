declare module 'cross-spawn' {
  export function spawn(command:string, args?:string[], options?:{}):NodeJS.EventEmitter
}

declare module 'shell-quote' {
  export function parse(args:string):string[]
}

interface RunnableModule {
  description?: string
  run: string | string[] | RunnableFactory
}

interface RunnableFactory {
  (args?:string[]): string | RunnableFunction
}

interface RunnableFunction {
  (args?:string[]): Promise<void> | void
}

interface Runnable {
  command?: string
  function?: RunnableFunction
  args: string[]
}
