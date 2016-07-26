var gulp = require('gulp');
var babel = require('babel-core');
var fs = require('fs');
var transform = require('./index');

gulp.task('default', function() {
  console.log('hi');
});

var watcher = gulp.watch('*.js', []);
watcher.on('change', function(event) {
  babel.transformFile(event.path, { plugins: [transform.plugin] }, function (err, result) {
    fs.writeFile('./test.txt', result.code); 
  });
});