/* eslint-disable @typescript-eslint/no-explicit-any */
import { isValidRunnable } from './isValidRunnable'

export function isValidRunnableSequence(value: any): boolean {
  if (Array.isArray(value) && value.length > 0)
    return value.every((item: any): boolean => (Array.isArray(item) && isValidRunnableSequence(item)) || isValidRunnable(item))

  return false
}
