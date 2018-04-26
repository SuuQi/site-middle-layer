import path from 'path';
import http from 'http';
import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';

// 清理发布目录
gulp.task('clean', done => {
    del.sync([ './dist/**/*' ], { 'force': true });
    return done();
});

gulp.task('dist', ['clean'], () =>
    gulp.src('./lib/**/*')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist'))
);