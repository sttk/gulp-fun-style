# gulp-fun [![Build Status][travis-image]][travis-url] [![Build Status][appveyor-image]][appveyor-url]

Gulp 4 plugin to write a gulpfile in fun style.

[![NPM][node-image]][node-url]

[travis-image]: https://travis-ci.org/sttk/gulp-fun-style.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/gulp-fun-style
[appveyor-image]: https://ci.appveyor.com/api/projects/status/github/sttk/gulp-fun-style?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/gulp-fun-style
[node-image]: https://nodei.co/npm/gulp-fun-style.png↲
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
fun.build = () => [[ clean, [ style, scripts ] ]]
fun.default = fun.build
```

### 2. Run gulp

```
$ gulp --tasks
[07:16:05] Tasks for ~/project/gulpfile.js
[07:16:05] └─┬ default
[07:16:05]   └─┬ build
[07:16:05]     └─┬ <series>
[07:16:05]       ├── clean
[07:16:05]       └─┬ <parallel>
[07:16:05]         ├── styles
[07:16:05]         └── scripts
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
fun.compile = () => [ fun.styles, fun.scripts ]
```

or

```js
fun.compile = () => [ 'styles', 'scripts' ]
```

### Define a series task

```js
fun.build = () => [[ fun.clean, fun.compile ]]
```

or

```js
fun.build = () => [[ 'clean', 'compile' ]]
```

### Expose a task

```js
fun.build.description = 'Expose a task by attach description'
```
    
> `gulp-fun-style` exposes tasks which satisfy both two conditions as follow:
>
> 1. task has `description` property or task's name is `'default'`.
> 2. task doesn't have `private` property which is `true`.


License
-------

Copyright (C) 2016 Takayuki Sato

This program is free software under [MIT](https://opensource.org/licenses/MIT) License.
See the file LICENSE in this distribution for more details.

