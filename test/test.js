var File = require('vinyl');
var assert = require('assert');
var es = require('event-stream');
var gulpSIML = require('../gulp-siml');

describe('gulp-siml', function () {

  it('should arbitrarily rename file extension when options.extension is specified', function(done){

    // create the fake file
    var fakeFile = new File({
      'path': 'template.siml',
      'contents': new Buffer('a')
    });

    // Create a prefixer plugin stream
    var plugin = gulpSIML({'extension': '.tmpl'});

    // write the fake file to it
    plugin.write(fakeFile);

    // wait for the file to come back out
    plugin.once('data', function(file) {

      // make sure the extension was changed
      assert.equal(file.path, 'template.tmpl');

      done();

    });

  });

  it('should rename file extension to .html when options.extension is unspecified', function(done){

    // create the fake file
    var fakeFile = new File({
      'path': 'template.siml',
      'contents': new Buffer('a')
    });

    // Create a prefixer plugin stream
    var plugin = gulpSIML();

    // write the fake file to it
    plugin.write(fakeFile);

    // wait for the file to come back out
    plugin.once('data', function(file) {

      // make sure the extension was changed
      assert.equal(file.path, 'template.html');

      done();

    });

  });

  it('should remove file extension when options.extension is a blank string', function(done){

    // create the fake file
    var fakeFile = new File({
      'path': 'template.siml',
      'contents': new Buffer('a')
    });

    // Create a prefixer plugin stream
    var plugin = gulpSIML({extension: ''});

    // write the fake file to it
    plugin.write(fakeFile);

    // wait for the file to come back out
    plugin.once('data', function(file) {

      // make sure the extension was changed
      assert.equal(file.path, 'template');

      done();

    });

  });

  describe('in streaming mode', function() {

    it('should compile SIML', function(done) {

      // create the fake file
      var fakeFile = new File({
        'path': 'template.siml',
        'contents': es.readArray(['a', '.class-name', '[href="#"]', ' "link text"'])
      });

      // Create a prefixer plugin stream
      var plugin = gulpSIML({pretty: false});

      // write the fake file to it
      plugin.write(fakeFile);

      // wait for the file to come back out
      plugin.once('data', function(file) {

        // make sure it came out the same way it went in
        assert(file.isStream());

        // buffer the contents to make sure it got prepended to
        file.contents.pipe(es.wait(function(err, data) {

          // check the contents
          assert.equal(data.toString('utf8'), '<a class="class-name" href="#">link text</a>');

          done();

        }));

      });

    });

  });

  describe('in buffer mode', function () {

    it('should compile SIML', function(done) {

      // create the fake file
      var fakeFile = new File({
        'path': 'template.siml',
        'contents': new Buffer('a.class-name[href="#"] "link text"')
      });

      // Create a prefixer plugin stream
      var plugin = gulpSIML({pretty: false});

      // write the fake file to it
      plugin.write(fakeFile);

      // wait for the file to come back out
      plugin.once('data', function(file) {

        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '<a class="class-name" href="#">link text</a>');

        done();

      });

    });

  });

});
