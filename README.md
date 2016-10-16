# gulp-fun-style [![Build Status][travis-image]][travis-url] [![Build Status][appveyor-image]][appveyor-url]

Gulp 4 plugin to write a gulpfile in fun style.

[![NPM][node-image]][node-url]

[travis-image]: https://travis-ci.org/sttk/gulp-fun-style.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/gulp-fun-style
[appveyor-image]: https://ci.appveyor.com/api/projects/status/github/sttk/gulp-fun-style?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/gulp-fun-style
[node-image]: https://nodei.co/npm/gulp-fun-style.png
[node-url]: https://nodei.co/npm/gulp-fun-style/

## Install

```js
$ npm i --save-dev gulpjs/gulp#4.0
$ npm i --save-dev gulp-fun-style
```

## Usage

### 1. Create your gulpfile

```js
const fun = require('gulp-fun-style')
fun.clean = () => { ... }
fun.styles = () => { ... }
fun.scripts = () => { ... }
fun.watch = () => { ... }
fun.build = [[ fun.clean, [ fun.style, fun.scripts ] ]]
fun.default = [[ 'build', 'watch' ]]
```

### 2. Run gulp

```
$ gulp --tasks
[23:24:17] Tasks for ~/project/gulpfile.js
[23:24:17] └─┬ default
[23:24:17]   └─┬ <series>
[23:24:17]     ├─┬ <series>
[23:24:17]     │ ├── clean
[23:24:17]     │ └─┬ <parallel>
[23:24:17]     │   ├── styles
[23:24:17]     │   └── scripts
[23:24:17]     └── watch
```

## Notations

### Define a task

```js
fun.clean = () => { ... }
```

or

```js
fun.clean = done => { ...; done() }
```

### Define a parallel task

```js
fun.compile = [ fun.styles, fun.scripts ]
```

or

```js
fun.compile = [ 'styles', 'scripts' ]
```

### Define a series task

```js
fun.build = [[ fun.clean, fun.compile ]]
```

or

```js
fun.build = [[ 'clean', 'compile' ]]
```

### Define a watch task

```js
fun.watchJs = { watch: 'js/**/*.js', call: ['uglify', 'reload'], options: opts }
```

or

```js
fun.watchJs = { watch: 'js/**/*.js', call: function(done) { ...; done(); }, options: opts }
```

* **watch** notation is expanded to a function which run `gulp.watch`, like:

    ```js
    fun.watchJs = { watch: glob, call: fn, options: opts }
   　　　 ↓
    fun.watchJs = gulp.watch(glob, opts, fn);
    ```

### Expose a task

```js
fun.build.description = 'Expose a task by attach description'
```
    
* **gulp-fun-style** exposes tasks which satisfy both two conditions as follow:

    1. task has `description` property or task's name is `'default'`.
    2. task doesn't have `private` property which is `true`.

### Inherit flag descriptions

```js
fun.build = [ 'clean', 'compile' ]
fun.build.description = 'Build.'
fun.build.flags = {
  '--b': 'Can rewrite a description by an upper task', 
}

fun.clean = () => { ... }
fun.clean.flags = {
  '--a': 'A flag for clean.',
}

fun.compile = () => { ... }
fun.compile.flags = {
  '--b': 'A flag for compile 1', 
  '--c': 'A flag for compile 2',
}
```

```
$ gulp --tasks
[12:17:14] Tasks for ~/project/gulpfile.js
[12:17:14] └─┬ build  Build.
[12:17:14]   │ --a    …A flag for clean.
[12:17:14]   │ --b    …Can rewrite a description by an upper task
[12:17:14]   │ --c    …A flag for compile 2
[12:17:14]   └─┬ <parallel>
[12:17:14]     ├── clean
[12:17:14]     └── compile

```

License
-------

Copyright (C) 2016 Takayuki Sato

This program is free software under [MIT](https://opensource.org/licenses/MIT) License.
See the file LICENSE in this distribution for more details.

G