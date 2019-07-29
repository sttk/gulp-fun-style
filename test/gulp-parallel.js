'use strict';

var expect = require('chai').expect;

var testtools = require('gulp-test-tools');
var runner = testtools.gulpRunner;
var eraseTime = testtools.eraseTime;
var eraseLapse = testtools.eraseLapse;
var skipLines = testtools.skipLines;
var headLines = testtools.headLines;

describe('Using gulp.parallel', function() {

  it('Should run tasks in parallel by `gulp`', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-parallel.js')
      .run(cb);

    function cb(err, stdout, stderr) {
      stdout = eraseLapse(eraseTime(skipLines(stdout, 2)));
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).to.equal(
        'Starting \'default\'...\n' +
        'Starting \'clean\'...\n' +
        'Starting \'watch\'...\n' +
        'clean\n' +
        'Finished \'clean\' after ?\n' +
        'Starting \'styles\'...\n' +
        'Starting \'scripts\'...\n' +
        'watch\n' +
        'Finished \'watch\' after ?\n' +
        'styles\n' +
        'Finished \'styles\' after ?\n' +
        'scripts\n' +
        'Finished \'scripts\' after ?\n' +
        'Finished \'default\' after ?\n'
      );
      done();
    }
  });

  it('Should output task tree by `gulp --tasks`', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-parallel.js', '--tasks')
      .run(cb);

    function cb(err, stdout, stderr) {
      stdout = eraseTime(skipLines(stdout, 2));
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).to.equal(
        '├── clean    Delete dist folder\n' +
        '├── styles   Compiles and bundles CSS\n' +
        '├── scripts  Bundles JavaScript\n' +
        '├── watch    Watch files and build on change\n' +
        '└─┬ default\n' +
        '  └─┬ <parallel>\n' +
        '    ├── clean\n' +
        '    ├─┬ <parallel>\n' +
        '    │ ├── styles\n' +
        '    │ └── scripts\n' +
        '    └── watch\n' +
      '');
      done();
    }
  });

  it('Should output task list by `gulp --tasks-simple`', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-parallel.js', '--tasks-simple')
      .run(cb);

    function cb(err, stdout, stderr) {
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).to.equal(
       'clean\n' +
       'styles\n' +
       'scripts\n' +
       'watch\n' +
       'default\n'
      );
      done();
    }
  });

});
