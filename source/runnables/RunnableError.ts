export class RunnableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RunnableError'
  }
}
