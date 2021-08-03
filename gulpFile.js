var gulp = require('gulp');
var rename = require('gulp-rename');

gulp.task('build', function(done) {
     gulp.src('SupportedGames/CryptoBlades/CryptoBlades.js')
    .pipe(rename({ basename: 'BladeMasterJS'}))
    .pipe(gulp.dest('./'));

    gulp.src('SupportedGames/DungeonSwap/DungeonSwap.js')
    .pipe(rename({ basename: 'DungeonMasterJS'}))
    .pipe(gulp.dest('./'));

    done();
});