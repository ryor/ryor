import * as ryor from '..'

test('Confirms module facade exports correct functions', ():void =>
{
  expect(ryor.fail).toBeDefined()
  expect(ryor.getNPSScriptDescriptions).toBeDefined()
  expect(ryor.outputHelpMessage).toBeDefined()
  expect(ryor.run).toBeDefined()
  expect(ryor.runNPSScripts).toBeDefined()
})
