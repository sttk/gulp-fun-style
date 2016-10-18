const gulp = require('gulp')
const fun = require('./');

fun.build = [[ 'clean', ['uglify', 'makedoc'] ]]
fun.build.description = 'Makes product files and documents.'

fun.clean = [ 'cleanDest', 'cleanDocs' ]
fun.clean.description = 'Cleans all product files.'

fun.cleanDest = () => console.log('cleanDest')
fun.cleanDocs = () => console.log('cleanDocs')

fun.uglify = () => console.log('uglify')

fun.makedoc = () => console.log('makedoc')

fun.watch = { watch: './*.json', call: 'build' }
fun.watch.description = 'Watches source files and builds if they are changed.'

fun.default = [ fun.watch ]
//fun.default = fun.watch
