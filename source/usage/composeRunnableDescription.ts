import type { RunnableModule } from '../modules'

export function composeRunnableDescription(runnableModule: RunnableModule): string | undefined {
  let description: string | undefined =
    typeof runnableModule.description === 'function'
      ? runnableModule.description()
      : typeof runnableModule.description === 'string'
        ? runnableModule.description
        : undefined

  if (typeof description !== 'string' || description === '') description = undefined

  return description
}
