/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject } from './isObject'

export function isPopulatedObject(value: any) {
  return isObject(value) && Object.keys(value).length > 0
}
