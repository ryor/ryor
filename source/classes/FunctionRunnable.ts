export class FunctionRunnable implements Runnable
{
  public constructor(public func:RunnableFunction, public args:string[] = [], public context:string) {}

  public run():Promise<RunnablesDefinition|void>
  {
    return Promise.resolve().then(():RunnablesDefinition|void|Promise<RunnablesDefinition|void> => this.func(this.args))
  }
}
