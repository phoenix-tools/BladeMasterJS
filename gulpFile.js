var gulp = require('gulp');
var rename = require('gulp-rename');
var gulp_remove_logging = require("gulp-remove-logging");

/*
gulp.task('build', function(done) {
    gulp.src('BladeMasterJS.debug.js')
    .pipe(gulp_remove_logging())
    .pipe(rename({ basename: 'BladeMasterJS'}))
    .pipe(gulp.dest('./'));

    done();
});*/