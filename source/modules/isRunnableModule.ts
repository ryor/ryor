/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPopulatedObject } from '../shared'

export function isRunnableModule(module: any) {
  return isPopulatedObject(module) && module.run !== undefined
}
