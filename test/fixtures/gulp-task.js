'use strict';

var fun = require('../../');

fun.clean = function() {
  console.log('clean');
};
fun.clean.description = 'Delete dist folder';

fun.styles = function() {
  console.log('styles');
  return true;
};
fun.styles.description = 'Compiles and bundles CSS';

fun.scripts = function(done) {
  console.log('scripts');
  done();
};
fun.scripts.description = 'Bundles JavaScript';

fun.watch = function() {
  console.log('watch');
};
fun.watch.description = 'Watch files and build on change';

fun.default = fun.watch;
