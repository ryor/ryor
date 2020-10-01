## (R)oll (Y)our (O)wn Task (R)unner for Node.js Projects

![pipeline](https://gitlab.com/ryor-/ryor/badges/master/pipeline.svg)
![coverage](https://gitlab.com/ryor-/ryor/badges/master/coverage.svg)
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

```node run```

or

```node run help [runnable]```

### Simple to use

```node run <runnable> [...args]```

or

```node run <runnable> [...args] + <runnable> [...args] + <runnable> [...args]```
