const fun = require('../..')

fun.build = [[ 'clean', 'uglify' ]]
fun.build.description = 'Makes product files.'

fun.clean = [ 'cleanDist', 'cleanDocs' ]
fun.clean.description = 'Cleans all product files.'

fun.cleanDist = () => console.log('clean dist. files')
fun.cleanDocs = () => console.log('clean document files')

fun.uglify = () => console.log('uglify')
