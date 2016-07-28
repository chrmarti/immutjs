var babel = require('gulp-babel');
var babelc = require('babel-core');
var rename = require('gulp-rename');
var transform = require('./index.js');
var through = require('through2'); 

var PluginError = require('gulp-util').PluginError;

// consts
var PLUGIN_NAME = 'gulp-immutjs';

module.exports = function() {
    return through.obj(function(file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            file.contents = file.contents.pipe(babel({
                plugins: [transform.plugin]
            }));            
        } else if (file.isBuffer()) {
            file.contents = Buffer.from(babelc.transform(file.contents.toString(), {
                plugins: [[transform.plugin, { libraryImport: true }]]
            }).code);
        }
        file.path = file.path.replace(/\.immut\.js$/, '.js');
        return callback(null, file);
    });
};