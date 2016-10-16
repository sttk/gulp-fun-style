'use strict';

var expect = require('chai').expect;

var testtools = require('gulp-test-tools');
var runner = testtools.gulpRunner;
var eraseTime = testtools.eraseTime;
var eraseLapse = testtools.eraseLapse;
var skipLines = testtools.skipLines;
var headLines = testtools.headLines;

var path = require('path');
var fs = require('fs');

var dir = path.join(__dirname, 'out');
var file1 = path.join(dir, 'file1.txt');
var logFile = path.join(__dirname, 'watch.log');


describe('Using `gulp.watch`', function() {

  it('Should show a watch task with --tasks flag', function(done) {
    runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-watch.js --tasks')
      .run(cb);

    function cb(err, stdout, stderr) {
      stdout = eraseTime(skipLines(stdout, 2));
      expect(err).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).to.equal(
        '├── default  Watch.\n' +
        '└── watch    Watch.\n' +
      '');
      done();
    }
  });

  it('Should run watch task by `gulp`', function(done) {
    this.timeout(0);

    fs.writeFileSync(file1, 'a', 'utf8');

    var child = runner({ verbose: false })
      .basedir(__dirname)
      .gulp('--gulpfile fixtures/gulp-watch.js')
      .run(cb);


    setTimeout(function() {
      expect(fs.readFileSync(file1, 'utf8')).to.equal('a');
      expect(fs.readFileSync(logFile, 'utf8')).to.equal('');
      fs.appendFileSync(file1, 'b', 'utf8');
    }, 1000);

    setTimeout(function() {
      expect(fs.readFileSync(file1, 'utf8')).to.equal('ab');
      expect(fs.readFileSync(logFile, 'utf8')).to.equal('1');
      fs.appendFileSync(file1, 'c', 'utf8');
    }, 2000);

    setTimeout(function() {
      expect(fs.readFileSync(logFile, 'utf8')).to.equal('12');
      expect(fs.readFileSync(file1, 'utf8')).to.equal('abc');
      fs.appendFileSync(file1, 'd', 'utf8');
    }, 3000);

    setTimeout(function() {
      expect(fs.readFileSync(logFile, 'utf8')).to.equal('123');
      expect(fs.readFileSync(file1, 'utf8')).to.equal('abcd');
      fs.appendFileSync(file1, 'e', 'utf8');
    }, 4000);

    setTimeout(function() {
      expect(fs.readFileSync(logFile, 'utf8')).to.equal('1234');
      expect(fs.readFileSync(file1, 'utf8')).to.equal('abcde');
      try {
        child.kill('SIGUP');
      } catch (e) {}
      expect(fs.readFileSync(logFile, 'utf8')).to.equal('1234');
      expect(fs.readFileSync(file1, 'utf8')).to.equal('abcde');
      done();
    }, 5000);

    function cb(err, stdout, stderr) {
      expect.to.fail();
      done();
    }
  });


  before(function() {
    clear(dir);
    fs.mkdirSync(dir);
  });

  after(function() {
    clear(dir);
  });
});

function clear(dir) {
  if (fs.existsSync(dir)) {
    if (fs.existsSync(file1)) {
      fs.unlinkSync(file1);
    }
    fs.rmdirSync(dir);
  }
  if (fs.existsSync(logFile)) {
    fs.unlinkSync(logFile);
  }
}
