export class FunctionRunnable implements Runnable {
  // eslint-disable-next-line no-useless-constructor
  public constructor (public func:RunnableFunction, public args:string[] = [], public context:string) {}

  public async run ():Promise<RunnablesDefinition|void> {
    return this.func(this.args)
  }
}
