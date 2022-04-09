export function isObject (value: any): boolean {
  return value !== undefined && typeof value === 'object' && value !== null
}
