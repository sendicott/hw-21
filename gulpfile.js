'use strict'

let gulp = require('gulp');
let browserify = require('gulp-browserify');
let sass = require('gulp-sass');

gulp.task('default', ['html', 'css', 'js']);

gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest('public/'));
});

gulp.task('css', function() {
    return gulp.src('style.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/'));
});

gulp.task('js', function () {
    return gulp.src('app.js')
        .pipe(browserify())
        .pipe(gulp.dest('public/'));
});

gulp.task('watch', function () {
    // when index.html changes, run html task
    gulp.watch('index.html', ['html']);
    gulp.watch('app.js', ['js']);
    gulp.watch('style.scss', ['css']);
});