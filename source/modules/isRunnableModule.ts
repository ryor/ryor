import { isPopulatedObject } from '../shared'

export function isRunnableModule (module: any): boolean {
  return isPopulatedObject(module) && module.run !== undefined
}
