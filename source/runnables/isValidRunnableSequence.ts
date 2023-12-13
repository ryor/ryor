/* eslint-disable @typescript-eslint/no-explicit-any */
import { isValidRunnable } from './isValidRunnable'

export function isValidRunnableSequence(value: any) {
  if (Array.isArray(value) && value.length > 0) return value.every((item) => (Array.isArray(item) && isValidRunnableSequence(item)) || isValidRunnable(item))

  return false
}
