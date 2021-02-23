export function isPopulatedObject (value: any): boolean {
  return typeof value === 'object' && value !== null && Object.keys(value).length > 0
}
