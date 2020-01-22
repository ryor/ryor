## (R)oll (Y)our (O)wn Task (R)unner for Node.js Projects

![pipeline](https://gitlab.com/ryor-/ryor/badges/master/pipeline.svg)
![coverage](https://gitlab.com/ryor-/ryor/badges/master/coverage.svg)
![license](https://img.shields.io/badge/License-MIT-green.svg)

### No system dependencies

Including **[ryor](https://www.npmjs.com/package/ryor)** as a project development dependency is all that's needed to get started.

### No plugins

Unlike task runners or pluggable build tools that require often clunky coordination between unevenly maintained 3rd-party plugins (Gulp, Grunt, Webpack, etc.), **ryor** offers a convenient means of using the tools that already [do one thing and do it well](https://en.wikipedia.org/wiki/Unix_philosophy) as CLIs or Node APIs.

### Less clutter

Instead of cluttering of a project's root directory and/or package.json file with configuration files/details, runnables can be neatly self-contained.

### Sequences

Similar to shell, npm/yarn or [NPS](https://www.npmjs.com/package/nps) scripts, sequences can be composed that run in series or parallel.

### Simple to get usage information

```node run```

or

```node run help```

### Simple to use

```node run <runnable> [...args]```

or

```node run <runnable> [...args] + <runnable> [...args] + <runnable> [...args]```

### Templates

#### Node modules

[Simple Node module](https://github.com/ryor/ryor-module)<br>
[Simple Node module with CLI](https://github.com/ryor/ryor-cli)

#### Static site generators

[Inferno SPA static site generator](https://github.com/ryor/ryor-static-gen-inferno)<br>
[Preact SPA static site generator](https://github.com/ryor/ryor-static-gen-preact)<br>
[React SPA static site generator](https://github.com/ryor/ryor-static-gen-react)

#### Desktop/Mobile applications

[Electron](https://github.com/ryor/ryor-electron)<br>
[React Native](https://github.com/ryor/ryor-react-native)

#### Serverless APIs

[Serverless - AWS Lambda](https://github.com/ryor/ryor-serverless-aws)<br>
[Serverless - Google Functions](https://github.com/ryor/ryor-serverless-google)<br>
[Serverless - OpenWhisk](https://github.com/ryor/ryor-serverless-openwhisk)

### Utility

[Command-line utility for initializing projects from ryor templates](https://github.com/ryor/ryor-init)

### Documentation

Coming soon.
