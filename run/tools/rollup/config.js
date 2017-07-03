import {EOL} from 'os'

const clean = {
  transformBundle: (source) => source.replace(`Object.defineProperty(exports, '__esModule', { value: true });${EOL}${EOL}`, '')
}

const autorun = {
  transformBundle: (source) => source.replace('exports.run = run;', 'run();')
}

export default {
  dest: 'build/index.js',
  entry: 'build/esm/index.js',
  external: ['chalk', 'cross-spawn', 'fs', 'os', 'path', 'shell-quote'],
  format: 'cjs',
  plugins: [clean, autorun]
}
