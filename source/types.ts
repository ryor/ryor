interface Configuration {
  usage?: ConfigurationUsage
}

interface ConfigurationUsage {
  types?: ConfigurationUsageTypes
}

interface ConfigurationUsageTypes {
  order?: string[]
}

interface DescriptionFactory {
  (): string;
}

interface Runnable {
  run():Promise<RunnablesDefinition|void>
}

interface RunnableFunction {
  (args?:string[]): RunnablesDefinition | void | Promise<RunnablesDefinition | void>
}

interface RunnableModule {
  description?: string | DescriptionFactory
  usage?: Usage | UsageFactory
  run: RunnablesDefinition
}

interface UsageFactory {
  (): Usage
}

interface UsageInformation {
  args?: string
  body?: string
}

type RunnableDefinition = Runnable | RunnableFunction | RunnableScript

type RunnablesDefinition = RunnableDefinition | RunnableDefinition[]

type RunnableScript = string | string[]

type Usage = string | UsageInformation
