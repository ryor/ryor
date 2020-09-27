import { isValidRunnable } from './isValidRunnable'

export function isValidRunnableSequence (value:any):boolean {
  if (!Array.isArray(value)) return isValidRunnable(value)

  if (value.length > 0) return value.every((item:any):boolean => (Array.isArray(item) && isValidRunnableSequence(item)) || isValidRunnable(item))

  return false
}
