/* eslint-disable @typescript-eslint/no-explicit-any */
export function isObject(value: any) {
  return value !== undefined && typeof value === 'object' && value !== null
}
