/* eslint-disable @typescript-eslint/no-explicit-any */
export function isObject(value: any): boolean {
  return value !== undefined && typeof value === 'object' && value !== null
}
