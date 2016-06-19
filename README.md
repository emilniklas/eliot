# Eliot

_Next generation JavaScript, simplified._

Every time you start a new JavaScript project, there is a bunch of configuration to be done.
If you want to use next generation JavaScript like ES2015/ES6 or even ES7, it gets even
more complicated. Then you need to make sure the output of your build is optimized in
production as well as in development.

Eliot does it all for you. One dependency. One executable. All the bleeding edge stuff.

- [x] ES6 syntax including modules
- [x] `async`/`await`
- [x] Polyfills
- [x] Minification and optimization for production
- [x] Source maps for development
- [x] JSX (opt-in)
- [x] Decorators (opt-in)

## Usage

Typically, you will interact with your JavaScript entry points in three ways:

* Running them directly in the terminal
* Including them in a web page using a `<script>` tag
* Running tests

Eliot makes them all super easy:

```shell
# Run
eliot file.js

# Build
eliot build --target node6 --entry file.js --output dist.js

# Test
eliot test --using mocha
```

## The CLI

Run a file by simply running `eliot file.js`. This will compile the file and run it.
Add JSX and/or decorator support by using the flags `--jsx` and `--decorators`.

Build a file with the `build` command. `--entry [file]` and `--output [file]` can be
used to specify the input and output. We also need to specify what target environment we're
building to. More on targets later.

Run tests using the `test` command. This will compile test files and send them to
whatever testing framework you're using.

## Configuration

Instead of having to pass everything as flags to the CLI, we can create a `eliot.config.js` file
in the root of our project. We can also create the file somewhere else and point to it using the
`--config` flag in the CLI.

The options specified in the config file is used if not overridden by flags passed in to the CLI.

```
export default {
  target: 'node6'
}
```

The above configuration makes it possible for us to run `eliot build --entry [input] --output [output]`
and have it default to using Node 6 as its target.

Instead of using magic strings we can import the Target object from the `eliot` package.

```
import { Target } from 'eliot/config'

export default {
  target: Target.ES5
}
```

We can add JSX and decorators support very easily:

```
export default {
  target: Target.ES5,
  decorators: true,
  jsx: true
}
```

Finally, we can configure our inputs and outputs. We can do that in multiple ways. If you have a
single target and a single input file, you can simply do this:

```
export default {
  target: Target.ES5,
  entry: 'entry.js',
  output: 'dist/entry.js'
}
```

Then run `eliot build` and we're golden.

However, we might want to compile the same entry point to multiple targets:

```
export default {
  targets: [
    { target: Target.ES5, output: 'dist/browser.js' },
    { target: Target.NODE6, output: 'dist/server.js' },
  ],
  entry: 'isomorphic.js',
}
```

Or, we might just have multiple entry points:

```
export default {
  targets: [
    { target: Target.ES5, entry: 'browser.js', output: 'dist/browser.js' },
    { target: Target.NODE6, entry: 'server.js', output: 'dist/server.js' },
  ]
}
```

In this case, since we don't have any common options for the targets, we can just
export an array directly:

```
export default [
  {
    target: Target.ES5,
    entry: 'browser.js',
    output: 'dist/browser.js'
  },
  {
    target: Target.NODE6,
    entry: 'server.js',
    output: 'dist/server.js'
  },
]
```

Each target can have its own options, or they can share options:

```
export default {
  targets: [
    { target: Target.ES5, entry: 'browser.js', output: 'dist/browser.js' },
    { target: Target.NODE6, entry: 'server.js', output: 'dist/server.js', decorators: true },
  ],
  jsx: true
}
```
