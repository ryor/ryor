module.exports = {
  description: 'Checks TypeScript for errors with TSLint',
  nps: `tslint -c run/tools/tslint/config.json -p run/tools/tsc/config.test.json --type-check 'source/**/*.ts' 2>&1 >/dev/null | node run/tools/tslint/trim-output`
}
