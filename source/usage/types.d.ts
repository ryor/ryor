export type Usage = string | UsageInformation

export interface UsageConfiguration {
  categories?: string[]
  ignore?: string | string[]
}

export interface UsageInformation {
  args?: string
  body?: string
}
