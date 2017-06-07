declare module 'nps' {
  interface Config {
    scriptConfig: NPSScripts
    scripts: string[]
    options: {[key:string]:boolean}
  }
  function nps(config:Config):Promise<number>
  export default nps
}

interface Command {
  function: () => void
}

interface NPSScripts {
  [key:string]: string | NPSScripts
}

interface Runnable {
  description?: string
  command?: Command
  nps?: string | NPSScripts
}
