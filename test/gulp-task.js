'use strict';

var expect = require('chai').expect;

var testtools = require('gulp-test-tools');
var runner = testtools.gulpRunner;
var eraseTime = testtools.eraseTime;
var eraseLapse = testtools.eraseLapse;
var skipLines = testtools.skipLines;
var headLines = testtools.headLines;

describe('Using gulp.task', function() {

  it('Should run single task by `gulp`', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-task.js')
      .run(cb);

    function cb(err, stdout, stderr) {
      stdout = eraseLapse(eraseTime(skipLines(stdout, 2)));
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).to.equal(
        "Starting 'default'...\n" +
        "watch\n" +
        "Finished 'default' after ?\n"
      );
      done();
    }
  });

  it('Should run `clean` task by `gulp clean`', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-task.js', 'clean')
      .run(cb);

    function cb(err, stdout, stderr) {
      stdout = eraseLapse(eraseTime(skipLines(stdout, 2)));
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).to.equal(
        "Starting 'clean'...\n" +
        "clean\n" +
        "Finished 'clean' after ?\n"
      );
      done();
    }
  });

  it('Should output task tree by `gulp --tasks`', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-task.js', '--tasks')
      .run(cb);

    function cb(err, stdout, stderr) {
      stdout = eraseLapse(eraseTime(skipLines(stdout, 2)));
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).to.equal(
       '├── clean    Delete dist folder\n' +
       '├── styles   Compiles and bundles CSS\n' +
       '├── scripts  Bundles JavaScript\n' +
       '├── watch    Watch files and build on change\n' +
       '└── default  Watch files and build on change\n' +
      '');
      done();
    }
  });

  it('Should output task list by `gulp --tasks-simple`', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-task.js', '--tasks-simple')
      .run(cb);

    function cb(err, stdout, stderr) {
      expect(err).to.be.null;
      expect(stdout).to.equal(
        'clean\n' +
        'styles\n' +
        'scripts\n' +
        'watch\n' +
        'default\n'
      );
      expect(stderr).to.be.empty;
      done();
    }
  });

});
