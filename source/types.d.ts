declare module 'nps' {
  interface Config {
    scriptConfig: NPSScripts
    scripts: string[]
    options: {[key:string]:boolean}
  }
  function nps(config:Config):Promise<number>
  export default nps
}

interface HelpList {
  label: string
  items: HelpListItem[]
}

interface HelpListItem {
  key: string
  value: string
}

interface NPSError {
  code: number
  message: string
  ref: string
}

interface NPSScripts {
  [key:string]: string | NPSScripts
}

interface Runnable {
  description?: string
  nps?: string | NPSScripts
}
