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

### Simple to get usage information

```node tasks```

or

```node tasks [runnable] -h```

### Simple to use

```node tasks <runnable> [...args]```

or

```node tasks <runnable> [...args] + <runnable> [...args] + <runnable> [...args]```

### Get Started

Create a subdirectory in your project root directory to contain your runnables ("tasks" is a good option) and put the following index.js file in it:

```js
import ryor from 'ryor'

ryor()
```

**Note:** ryor uses ES module importing so ```"type": "module"``` in the project's package.json file is required.

A runnable module is any JS file that exports a "run" value, which can be a string, an array, a function or an asynchronous function:

minify.js
```js
export const run = 'minify --option1 --option2 path/to/file'
```

build.js
```js
export const run = [
  'transpile',
  'minify'
]
```

transpile.js
```js
export function run() {
  const path = ...

  return `transpiler --path ${path}`
}
```

test.js
```js
export async function test() {
  const tester = await import('tester')
  const result = await tester.test()
  
  console.log('Tests complete.')
}
```

A runnable module containing a function/async function runnable can be passed argument and they can be defined in the **args** export:

test.js
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

Like in the above module, a **description** export should be provided for usage information. The above module can be run with the following shell commands:

```node tasks test```

or

```node tasks test -c```

or

```node tasks test --coverage```


To output usage information for the above module, use one of the following commands:

```node tasks test -h```

or

```node tasks test --help```


Which should output the following:

```
Usage: node tasks test [options]

Runs tester and optionally collects coverage information

-c  --coverage  Collect coverage data
-h  --help      Displays this usage information
```
