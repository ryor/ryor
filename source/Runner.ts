import {resolveRunnable, runRunnable} from './utils/runnables'

export class Runner
{
  public constructor(public definitions:Array<RunnableDefinition|RunnableDefinition[]> = [], public context?:string) {}

  public run():Promise<void>
  {
    return this.next()
  }

  private next():Promise<void>
  {
    if (this.definitions.length > 0)
    {
      const definition:RunnableDefinition|RunnableDefinition[]|undefined = this.definitions.shift()
      let promise:Promise<RunnableDefinition|Array<RunnableDefinition|RunnableDefinition[]>|void|void[]>

      if (Array.isArray(definition) && Array.isArray(definition[0]))
        promise = Promise.all((definition[0] as string[]).map((value:string):Promise<void> => new Runner([value], this.context).run()))

      else
      {
        const runnable:Runnable|Runner = resolveRunnable(definition as RunnableDefinition, this.context)

        if (runnable instanceof Runner)
          promise = runnable.run()

        else
        {
          promise = runRunnable(runnable)

          if (runnable.function !== undefined)
            promise = promise.then((result:RunnableDefinition|Array<RunnableDefinition|RunnableDefinition[]>|void):Promise<void>|void =>
            {
              if (result !== undefined)
              {
                let definitions:Array<RunnableDefinition|RunnableDefinition[]>|undefined

                if (typeof result === 'string')
                  definitions = [result]

                else if (Array.isArray(result))
                  definitions = (result as Array<RunnableDefinition|RunnableDefinition[]>)
                    .map((value:RunnableDefinition|RunnableDefinition[]):RunnableDefinition|RunnableDefinition[] =>
                    {
                      if (typeof value === 'string')
                        return value

                      return [value as string[]]
                    })

                if (definitions !== undefined)
                  return new Runner(definitions, runnable.context).run()
              }
            })
        }
      }

      return promise.then(():Promise<void>|void =>
      {
        if (this.definitions.length > 0)
          return this.next()
      })
    }

    return Promise.resolve()
  }
}
