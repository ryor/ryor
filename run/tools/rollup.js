module.exports = {
  description: 'Bundles ES modules produced by TypeScript into single CommonJS module with Rollup',
  nps: 'rollup -e chalk,fs,minimist,nps,os,path -f cjs -o build/ryor.js build/index.js'
}
