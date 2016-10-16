'use strict';

var fun = require('../..')

fun.build = [[ 'clean', 'uglify' ]]
fun.build.description = 'Makes product files.'

fun.clean = [ 'cleanDist', 'cleanDocs' ]
fun.clean.description = 'Cleans all product files.'

fun.cleanDist = function() {
  console.log('clean dist. files');
};
fun.cleanDocs = function() {
  console.log('clean document files');
};

fun.uglify = function() {
  console.log('uglify');
};
