'use strict';

var expect = require('chai').expect;

var testtools = require('gulp-test-tools');
var runner = testtools.gulpRunner;
var eraseTime = testtools.eraseTime;
var eraseLapse = testtools.eraseLapse;
var skipLines = testtools.skipLines;
var headLines = testtools.headLines;

describe('Using `gulp.series`', function() {

  it('Should run series task by `gulp`', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-series.js')
      .run(cb);

    function cb(err, stdout, stderr) {
      stdout = eraseLapse(eraseTime(skipLines(stdout, 2)));
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).to.equal(
        'Starting \'default\'...\n' +
        'Starting \'clean\'...\n' +
        'clean\n' +
        'Finished \'clean\' after ?\n' +
        'Starting \'scripts\'...\n' +
        'Starting \'styles\'...\n' +
        'scripts\n' +
        'Finished \'scripts\' after ?\n' +
        'styles\n' +
        'Finished \'styles\' after ?\n' +
        'Starting \'watch\'...\n' +
        'watch\n' +
        'Finished \'watch\' after ?\n' +
        'Finished \'default\' after ?\n'
      );
      done();
    }
  });

  it('Should output task tree by `gulp --tasks`', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-series.js', '--tasks')
      .run(cb);

    function cb(err, stdout, stderr) {
      stdout = eraseTime(skipLines(stdout, 2));
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).to.equal(
        '├─┬ default       Build and watch for changes\n' +
        '│ │ --comment     …preserve comments\n' +
        '│ │ --dev         …un-minified js for develop\n' +
        '│ │ --production  …compressed into single bundle\n' +
        '│ └─┬ <series>\n' +
        '│   ├─┬ <series>\n' +
        '│   │ ├── clean\n' +
        '│   │ └─┬ <parallel>\n' +
        '│   │   ├── scripts\n' +
        '│   │   └── styles\n' +
        '│   └── watch\n' +
        '└── serve         Serves files reloading\n' +
        '    --lr          …with live reloading\n'
      );
      done();
    }
  });

  it('Should output task list by `gulp --tasks-simple`', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-series.js', '--tasks-simple')
      .run(cb);

    function cb(err, stdout, stderr) {
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).to.equal(
       'serve\n' +
       'default\n'
      );
      done();
    }
  });
});
