var siml = require('siml');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var VinylBufferStream = require('vinyl-bufferstream');

var PLUGIN_NAME = 'gulp-siml';

module.exports = function (options) {

  var vinylBufferStream = null;

  if (typeof options === 'undefined' || options === null) {
    options = {};
  }

  if (!options.extension && options.extension !== '') {
    options.extension = '.html';
  }

  if (typeof options.extension !== 'string') {
    this.emit('error', new PluginError(PLUGIN_NAME, 'extension must be a string', { fileName: file.path }));
  }

  vinylBufferStream = new VinylBufferStream(function(buffer, done) {
    var compiledSIML = siml.angular.parse(buffer.toString('utf-8'), options);
    done(null, new Buffer(compiledSIML));
  });

  return through.obj(function(file, encoding, callback) {

    var _this = this;

    vinylBufferStream(file, function(error, contents) {

      file.path = file.path.replace(/.siml$/, options.extension);

      if (error) {
        _this.emit('error', new PluginError(PLUGIN_NAME, err, { fileName: file.path }));
      } else {
        file.contents = contents;
        _this.push(file);
      }

      callback();

    });

  });

};
