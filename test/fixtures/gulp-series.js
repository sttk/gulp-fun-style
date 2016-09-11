'use strict';

var fun = require('../../');

fun.clean = function() {
  console.log('clean');
};

fun.styles = function() {
  console.log('styles');
};
fun.styles.flags = {
  '--production': 'compressed into single bundle',
};

fun.scripts = function(done) {
  console.log('scripts');
  done();
};
fun.scripts.flags = {
  '--dev': 'un-minified',
};

fun.build = [[ 'clean', [ fun.scripts, 'styles' ] ]];

fun.serve = function() {
  console.log('serve');
};
fun.serve.description = 'Serves files reloading';
fun.serve.flags = {
  '--lr': 'with live reloading',
};

fun.watch = function() {
  console.log('watch');
};

fun.default = [[ 'build', fun.watch ]];
fun.default.description = 'Build and watch for changes';
