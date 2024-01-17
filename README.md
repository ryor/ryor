## (R)oll (Y)our (O)wn Task (R)unner for Node.js Projects

![license](https://img.shields.io/badge/License-MIT-green.svg)

### No system dependencies

Including **[ryor](https://www.npmjs.com/package/ryor)** as a project development dependency is all that's needed to get started.

### No plugins

Unlike task runners or pluggable build tools that require often clunky coordination between unevenly maintained 3rd-party plugins (Gulp, Grunt, Webpack, etc.), ryor offers a convenient means of using tools that already [do one thing and do it well](https://en.wikipedia.org/wiki/Unix_philosophy) as CLIs or Node APIs.

### Less clutter

Instead of cluttering of a project's root directory and/or package.json file with configuration files/details, runnables can be neatly self-contained.

### Concurrency

Similar to shell, npm or [NPS](https://www.npmjs.com/package/nps) scripts, sequences can be composed that run runnables either serially or concurrently.

<br />

### Get started:

First, install ryor as a project development dependency: `npm install -D ryor`

Next, create a subdirectory in your project's root directory for your task runner and runnable ES modules ("tasks" is a good option). A runnable module must export a **run** value, which can be a string, an array or a function (sync or async). Runnable modules should also export a **description** value describing what the runnable does ("No description provided" is output in the CLI usage information for the runnable otherwise).

**Note:** `"type": "module"` in the project's package.json file is required and version 16 or greater of Node.js is recommended.

<br />

### Create runnables:

A string run value can be used to call a CLI:

_tasks/minify.js_

```js
export const description = 'Minifies JavaScript'

export const run = 'minifier --option1 --option2 path/to/file'
```

<br />

A configuration file can be included alongside a runnable ES module by simply creating a directory with an index.js file:

_tasks/minify/index.js_

```js
export const description = 'Minifies JavaScript'

export const run = 'minifier --config tasks/minify/config.js'
```

<br />

An array run value can be used to call other runnables, CLIs or functions in sequence:

_tasks/build.js_

```js
export const description = 'Creates production build'

export const run = ['transpile', 'minify', () => (...do something), 'echo "Done."',]
```

<br />

An array run value that begins with the flag **-c** or **--concurrent** will run anything following it concurrently:

_tasks/develop.js_

```js
export const description = 'Runs development watchers and server'

export const run = ['-c', 'transpile --watch', 'lint --watch', 'serve', () => (...start some process for development)]
```

<br />

A run function can be passed arguments which are defined in the **args** export:

_tasks/test.js_

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

<br />

A run function can return strings, arrays or functions to run:

_tasks/build.js_

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

<br />

### Create a runner:

Add an index.js file in your runnables directory that specifies your runnables like this:

_tasks/index.js_

```js
import ryor from 'ryor'

ryor(['build', 'develop', 'test'])
```

or, if runnables are separated into subdirectories, like this:

```js
import ryor from 'ryor'

ryor([
  ['main', ['build', 'develop', 'test']],
  ['tools', ['eslint', 'jest', 'tsc']],
  ['utilities', ['log']]
])
```

<br />

### Usage information:

To output usage information for all runnables, simply run `node [directory name]`.

To output usage information for a specific runnable: `node [directory name] <runnable> -h/--help`

**Note:** When defining arguments for a runnable module, note that **help** and its **h** alias are both reserved for all modules.

<br />

### Usage:

To run a single runnable: `node [directory name] <runnable> [...args]`

To run more than one runnable in sequence:

`node [directory name] <runnable> [...args] + <runnable> [...args] + <runnable> [...args]`
