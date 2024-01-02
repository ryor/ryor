## (R)oll (Y)our (O)wn Task (R)unner for Node.js Projects

![license](https://img.shields.io/badge/License-MIT-green.svg)

### No system dependencies

Including **[ryor](https://www.npmjs.com/package/ryor)** as a project development dependency is all that's needed to get started.

### No plugins

Unlike task runners or pluggable build tools that require often clunky coordination between unevenly maintained 3rd-party plugins (Gulp, Grunt, Webpack, etc.), **ryor** offers a convenient means of using tools that already [do one thing and do it well](https://en.wikipedia.org/wiki/Unix_philosophy) as CLIs or Node APIs.

### Less clutter

Instead of cluttering of a project's root directory and/or package.json file with configuration files/details, runnables can be neatly self-contained.

### Concurrency

Similar to shell, npm or [NPS](https://www.npmjs.com/package/nps) scripts, sequences can be composed that run runnables either serially or concurrently.

### Get Started

Install **ryor** as a project development dependency:

`npm install -D ryor`

Create a subdirectory in your project root directory ("tasks" is a good option) and add runnables, either in that directory or nested one level into subdirectories to organize them into categories. A runnable is an ES module that exports a **run** value, which can be a string, an array, a function or an asynchronous function. Runnable modules should also export a **description** value describing what the runnable does; "No description provided" is output in the usage information for the runnable
otherwise.

**Note:** `"type": "module"` in the project's package.json file is required and version 16 or greater of Node.js is recommended.

### Examples

A string runnable can be used to call a CLI:

[runnables directory]/minify.js

```js
export const description = 'Minifies JavaScript'

export const run = 'minify --option1 --option2 path/to/file'
```

An array runnable can be used to call other runnables and/or CLIs and run functions in sequence:

[runnables directory]/build.js

```js
export const description = 'Creates production build'

export const run = ['transpile', 'minify', () => (...do something), 'echo "Done."',]
```

An array runnable that begins with the flag **-c** or **--concurrent** will run anything following it concurrently:

[runnables directory]/develop.js

```js
export const description = 'Runs development watchers and server'

export const run = ['-c', 'transpile --watch', 'lint --watch', 'serve', () => (...start some process for development)]
```

A runnable function or async function can be passed arguments which are defined in the **args** export:

[runnables directory]/test.js

```js
export const description = 'Runs tester and optionally collects coverage information'

export const args = {
  coverage: {
    alias: 'c',
    description: 'Collect coverage data',
    type: 'boolean'
  }
}

export async function run({ coverage }) {
  const tester = await import('tester')
  const result = await tester.test(coverage)

  console.log(`Tests complete${coverage ? ' and coverage data collected' : ''}`)
}
```

A runnable function or async function can return other runnable definitions:

[runnables directory]/build.js

```js
export const description = 'Creates production build'

export const args = {
  quiet: {
    alias: 'q',
    description: 'No output unless errors are encountered',
    type: 'boolean'
  }
}

export function run({ quiet }) {
  const startTime = Date.now()
  const sequence = [`transpile${quiet ? ' -d' : ''}`, `minify${quiet ? ' -d' : ''}`]

  if (!quiet) sequence.push(`echo "Build took ${Date.now() - startTime}ms."`)

  return sequence
}
```

### The runner

Add an index.js file in your runnables directory that specifies your runnables:

```js
import ryor from 'ryor'

ryor(['build', 'develop', 'test'])
```

or

```js
import ryor from 'ryor'

ryor([
  ['main', ['build', 'develop', 'test']],
  ['tools', ['eslint', 'jest', 'tsc']],
  ['utilities', ['log']]
])
```

To output usage information for any runnable module, use one of the following commands:

`node tasks test -h`

or

`node tasks test --help`

Which should output the following for the **test** runnable above:

```
Usage: node tasks test [options]

Runs tester and optionally collects coverage information

-c  --coverage  Collect coverage data
-h  --help      Displays this usage information
```

### Simple to get usage information

`node tasks`

or

`node tasks [runnable] -h`

### Simple to use

`node tasks <runnable> [...args]`

or

`node tasks <runnable> [...args] + <runnable> [...args] + <runnable> [...args]`
