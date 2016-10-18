'use strict';

var fun = require('../../');
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

var watchDir = path.join(__dirname, '../out/*');
var logFile = path.join(__dirname, '../watch.log');

var counter = 0;
fs.writeFile(logFile, '', 'utf8');

fun.watch = {
  watch: [watchDir],
  call: function() {
    counter ++;
    fs.appendFile(logFile, counter, 'utf8');
  },
};
fun.watch.description = 'Watch.';

fun.watch2 = {
  watch: [watchDir],
  call: [[ 'task1', 'task2' ]],
};
fun.watch2.description = 'Watch2.';

fun.task1 = function() {
};
fun.task2 = function() {
};

fun.default = fun.watch;

fun.watchSet = [ fun.watch, 'watch2' ];
fun.watchSet.description = 'Watch set.';
