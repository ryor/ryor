import { isObject } from './isObject'

export function isPopulatedObject (value: any): boolean {
  return isObject(value) && Object.keys(value).length > 0
}
