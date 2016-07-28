var gulp = require('gulp');
var rename = require('gulp-rename');
var immutjs = require('./gulpplugin');

gulp.task('default', () => {
    return gulp.src('examples/*.immut.js')
        .pipe(immutjs())
        .pipe(rename(function (path) {
            path.extname = ".plain.js"
        }))
        .pipe(gulp.dest('examples'));
});

var watcher = gulp.watch('examples/*.immut.js', ['default']);
watcher.on('change', function(event) {});