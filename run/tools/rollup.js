const description = 'Bundles ES modules produced by TypeScript into single CommonJS module with Rollup'

const run = 'rollup -e chalk,cross-spawn,fs,os,path,shell-quote -f cjs -o build/index.js build/esm/index.js'

module.exports = {description, run}
