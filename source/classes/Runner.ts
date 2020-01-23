import { resolveRunnableFromScript } from '../lib/runnables'
import { CommandRunnable } from './CommandRunnable'
import { FunctionRunnable } from './FunctionRunnable'

export class Runner implements Runnable {
  // eslint-disable-next-line no-useless-constructor
  public constructor (public sequence:RunnablesDefinition[] = [], public context?:string) {}

  public async run ():Promise<void> {
    while (this.sequence.length > 0) {
      const sequenceItem:RunnablesDefinition = this.sequence.shift()!

      if (this.context !== undefined && Array.isArray(sequenceItem)) {
        await Promise.all((sequenceItem as string[]).map((value:RunnablesDefinition):Promise<void> => new Runner([value], this.context).run()))
      } else {
        const runnable:Runnable = sequenceItem instanceof CommandRunnable || sequenceItem instanceof FunctionRunnable || sequenceItem instanceof Runner
          ? sequenceItem
          : typeof sequenceItem === 'function'
            ? new FunctionRunnable(sequenceItem, [], this.context!)
            : resolveRunnableFromScript(sequenceItem as RunnableScript, this.context)
        let result = await runnable.run()

        if (runnable instanceof FunctionRunnable && result) result = await new Runner(Array.isArray(result) ? result : [result], runnable.context).run()
      }
    }
  }
}
