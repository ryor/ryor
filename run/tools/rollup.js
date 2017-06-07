module.exports = {
  description: 'Bundles ES modules produced by TypeScript into single CommonJS module with Rollup',
  nps: 'rollup -e chalk,crypto,fs,minimist,nps,os,path -f cjs -o build/index.js build/index.js'
}
