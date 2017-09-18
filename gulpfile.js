(function () {
    'use strict';

    var config = require('./package.json');
    var gulp = require('gulp');
    var livereload = require('gulp-livereload');
    var notify = require('gulp-notify');
    var plumber = require('gulp-plumber');
    var sass = require('gulp-sass');
    var browserSync = require('browser-sync').create();
    var ts = require('gulp-typescript');



    gulp.task('hello', function () {
        console.log('Hello ' + config.author);
    });

    gulp.task('sass', function () {
        return gulp.src('app/*.scss')
            .pipe(plumber({
                errorHandler: notify.onError("Error parsing SASS!")
            }))
            .pipe(sass()) // Converts Sass to CSS with gulp-sass
            .on('error', sass.logError)
            .pipe(gulp.dest('app'))
            .pipe(notify('SASS compiled!'))
            .pipe(browserSync.reload({
                stream: true
            }))

    });
    gulp.task('watch', ['browserSync'], function () {
        console.log('Hello ' + config.author + '! Time to watch some Styles!');
        gulp.watch('app/*.scss', ['sass']);
        gulp.watch('app/*.html', browserSync.reload);
        gulp.watch('app/*.js', browserSync.reload);
    })

    gulp.task('browserSync', function () {
        browserSync.init({
            server: {
                baseDir: 'app'
            },
        })
    })
    gulp.task('ts', function () {
        return gulp.src('app/*.ts')
            .pipe(ts({
                noImplicitAny: true,
                outFile: 'output.js'
            }))
            .pipe(gulp.dest('built/local'));
    });
})();
