import {resolveOperation} from './operations'
import {runRunnable} from './runnables'

export default class Runner
{
  constructor(public operations:(RunnableDefinition|Runnable)[]){}

  public next():Promise<void>
  {
    if (this.operations.length > 0)
    {
      let operation:RunnableDefinition|Runnable|(RunnableDefinition|Runnable)[] = this.operations.shift()!

      if (Array.isArray(operation))
      {
        if (Array.isArray(operation[0]))
        {
          const promises:Promise<void>[] = (operation[0] as string[]).map((definition:string):Promise<void> =>
          {
            operation = resolveOperation(definition)

            if (Array.isArray(operation))
              return new Runner(operation).next()

            return runRunnable(operation as Runnable, this)
          })

          this.operations = []

          return Promise.all(promises).then(():Promise<void> => this.next())
        }

        operation = resolveOperation(operation as RunnableDefinition)

        if (Array.isArray(operation))
        {
          this.operations = (operation as (RunnableDefinition|Runnable)[]).concat(this.operations)

          return this.next()
        }
      }

      return runRunnable(operation as Runnable, this).then(():Promise<void> => this.next())
    }

    return Promise.resolve()
  }
}
