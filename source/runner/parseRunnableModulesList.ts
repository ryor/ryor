import {
  DUPLICATE_RUNNABLE_MODULE_NAME_ERROR_MESSAGE,
  INVALID_RUNNABLE_MODULES_LIST_ERROR_MESSAGE,
  INVALID_RUNNABLE_MODULES_LIST_ITEM_ERROR_MESSAGE
} from './constants'
import { EntryRunnableModulesList, RunnableModulesList } from './types'

export function parseRunnableModulesList(entry: EntryRunnableModulesList = []) {
  if (!Array.isArray(entry)) throw new Error(INVALID_RUNNABLE_MODULES_LIST_ERROR_MESSAGE.replace('[VALUE]', JSON.stringify(entry)))

  const list: RunnableModulesList = []
  const names: string[] = []

  if (entry.length > 0) {
    for (const item of entry) {
      if (Array.isArray(item)) {
        if (item.length < 2) throw new Error(INVALID_RUNNABLE_MODULES_LIST_ITEM_ERROR_MESSAGE.replace('[VALUE]', JSON.stringify(item)))

        const [category, arg] = item

        if (Array.isArray(arg)) {
          for (const name of arg) {
            if (names.includes(name)) throw new Error(DUPLICATE_RUNNABLE_MODULE_NAME_ERROR_MESSAGE.replace('[VALUE]', JSON.stringify(item)))

            list.push([name, category])
            names.push(name)
          }
        } else if (typeof arg === 'string') {
          if (names.includes(arg)) throw new Error(DUPLICATE_RUNNABLE_MODULE_NAME_ERROR_MESSAGE.replace('[VALUE]', JSON.stringify(item)))

          list.push([arg, category])
          names.push(arg)
        } else throw new Error(INVALID_RUNNABLE_MODULES_LIST_ITEM_ERROR_MESSAGE.replace('[VALUE]', JSON.stringify(item)))
      } else if (typeof item === 'string') {
        if (names.includes(item)) throw new Error(DUPLICATE_RUNNABLE_MODULE_NAME_ERROR_MESSAGE.replace('[VALUE]', JSON.stringify(item)))

        list.push([item])
        names.push(item)
      } else throw new Error(INVALID_RUNNABLE_MODULES_LIST_ITEM_ERROR_MESSAGE.replace('[VALUE]', JSON.stringify(item)))
    }
  }

  return list
}
