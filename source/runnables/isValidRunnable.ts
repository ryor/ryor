/* eslint-disable @typescript-eslint/no-explicit-any */
export function isValidRunnable(value: any) {
  return (typeof value === 'string' && value !== '') || typeof value === 'function'
}
