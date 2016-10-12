'use strict'

var expect = require('chai').expect
var semver = require('semver')

var testtools = require('gulp-test-tools');
var runner = testtools.gulpRunner;
var eraseTime = testtools.eraseTime;
var eraseLapse = testtools.eraseLapse;
var skipLines = testtools.skipLines;
var headLines = testtools.headLines;

var gulpfile;
if (semver.gte(process.version, '4.0.0')) {
  gulpfile = 'fixtures/gulpfile-01.js';
} else {
  gulpfile = 'fixtures/gulpfile-01_.js';
}

describe('Using `gulpfile example 01`', function() {

  it('Should run a gulp task', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile', gulpfile, 'build')
      .run(cb);

    function cb(err, stdout, stderr) {
      expect(eraseLapse(eraseTime(skipLines(stdout, 2)))).to.equal(
        "Starting 'build'...\n" +
        "Starting 'cleanDist'...\n" +
        "Starting 'cleanDocs'...\n" +
        "clean dist. files\n" +
        "Finished 'cleanDist' after ?\n" +
        "clean document files\n" +
        "Finished 'cleanDocs' after ?\n" +
        "Starting 'uglify'...\n" +
        "uglify\n" +
        "Finished 'uglify' after ?\n" +
        "Finished 'build' after ?\n" +
      "");
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      done();
    }
  });

  it('Should show tree of gulp tasks', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile', gulpfile, '--tasks')
      .run(cb);

    function cb(err, stdout, stderr) {
      expect(eraseLapse(eraseTime(skipLines(stdout, 2)))).to.equal(
        "├─┬ build  Makes product files.\n" +
        "│ └─┬ <series>\n" +
        "│   ├─┬ <parallel>\n" +
        "│   │ ├── cleanDist\n" +
        "│   │ └── cleanDocs\n" +
        "│   └── uglify\n" +
        "└─┬ clean  Cleans all product files.\n" +
        "  └─┬ <parallel>\n" +
        "    ├── cleanDist\n" +
        "    └── cleanDocs\n" +
      "");
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      done();
    }
  });
});
