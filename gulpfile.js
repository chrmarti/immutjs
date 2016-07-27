var gulp = require('gulp');
var rename = require('gulp-rename');
var immutjs = require('./gulpplugin');

gulp.task('default', () => {
    return gulp.src('*.js')
        .pipe(immutjs())
        .pipe(rename(function (path) {
            path.extname = ".immutable.js"
        }))
        .pipe(gulp.dest('build'));
});

var watcher = gulp.watch('*.js', ['default']);
watcher.on('change', function(event) {});