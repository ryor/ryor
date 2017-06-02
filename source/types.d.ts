declare module 'nps' {
  interface Config {
    scriptConfig: NPSScriptsConfiguration
    scripts: string[]
    options: {[key:string]:boolean}
  }
  function nps(config:Config):Promise<number>
  export default nps
}

interface CommandDefinition {
  description: string
  options?: CommandOptionDefinitions
  values?: CommandValuesDefinition
}

interface CommandFunction {
  (arguments:CommandFunctionArguments): void
}

interface CommandFunctionArguments {
  [key:string]:{}
}

interface CommandOptionDefinition {
  description: string
  alias?: string
  type?: string
}

interface CommandOptionDefinitions {
  [key:string]: string | CommandOptionDefinition
}

interface CommandValuesDefinition {
  key: string
  description: string
  required?: 1
  limit?: number
  accepts?: {[key:string]:string}
  defaults?: string
}

interface CommandOption {
  alias: string
  description: string
  type: string
}

interface CommandOptions {
  [key:string]: CommandOption
}

interface CommandModule {
  define?:() => CommandDefinition
  run?:CommandFunction
  nps?: string
}

interface HelpCommandArguments {
  command: string
}

interface HelpItem {
  key: string
  value: string
}

interface NPSCommandArguments {
  debug: boolean
  scripts: string[]
}

interface NPSConfiguration {
  scripts: NPSScriptsConfiguration
}

interface NPSError {
  code: number
  message: string
  ref: string
}

interface NPSOptions {
  debug: boolean
}

interface NPSScriptDescriptions {
  [key:string]: string
}

interface NPSScriptsConfiguration {
  [key:string]: string | NPSScriptsConfiguration
}
