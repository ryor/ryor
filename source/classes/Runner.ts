import { resolveRunnableFromScript } from '../lib/runnables'
import { CommandRunnable } from './CommandRunnable'
import { FunctionRunnable } from './FunctionRunnable'

export class Runner implements Runnable {
  // eslint-disable-next-line no-useless-constructor
  public constructor (public definitions:RunnablesDefinition[] = [], public context?:string) {}

  public run ():Promise<void> {
    return this.next()
  }

  private next ():Promise<void> {
    if (this.definitions.length > 0) {
      const definition:RunnablesDefinition = this.definitions.shift()!
      let promise:Promise<RunnablesDefinition|void|void[]>

      if (this.context !== undefined && Array.isArray(definition)) { promise = Promise.all((definition as string[]).map((value:RunnablesDefinition):Promise<void> => new Runner([value], this.context).run())) } else {
        const runnable:Runnable = definition instanceof CommandRunnable || definition instanceof FunctionRunnable || definition instanceof Runner
          ? definition
          : typeof definition === 'function'
            ? new FunctionRunnable(definition, [], this.context!)
            : resolveRunnableFromScript(definition as RunnableScript, this.context)

        promise = runnable.run()

        if (runnable instanceof FunctionRunnable) {
          promise = promise
            .then((result:RunnablesDefinition|void):Promise<void>|void => {
              if (result !== undefined) { return new Runner(Array.isArray(result) ? result : [result], runnable.context).run() }
            })
        }
      }

      return promise.then(():Promise<void>|void => {
        if (this.definitions.length > 0) { return this.next() }
      })
    }

    return Promise.resolve()
  }
}
