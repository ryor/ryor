/* eslint no-use-before-define: off */
import { UsageConfiguration } from '../usage'

export interface RunnerConfiguration {
  directory: string
  options?: RunnerOptions
  usage?: UsageConfiguration
}

export interface RunnerOptions {
  debug?: boolean
  help?: boolean
  time?: boolean
}
