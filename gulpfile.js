'use strict';

var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");

var watchify = require('watchify');
var gutil = require('gulp-util');

var browserSync = require('browser-sync').create();

var paths = {
    //tsConfig: 'src/client/tsconfig.json',
    //outDev: 'dist/bundle.dev.js',
    //tempDst: 'src/client/tmp/entry.js',
    pages: 'src/client/**/*.+(html|css)',
    dist: 'dist',
    finalDest: 'dist/js',
    finalBundle: 'bundle.js'
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/client/index.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));


gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.watch('src/client/**/*.html', ['copy-html']);


gulp.task('browserSync', function () {
    browserSync.init({
        proxy: {
            target: "localhost:3000"
        }
    });
});


function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source(paths.finalBundle))
        .pipe(gulp.dest(paths.finalDest))
        .pipe(browserSync.reload({
            stream: true
        }));
}

gulp.task('default', ['copy-html', 'browserSync'], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);

/*
gulp.task("compile-client", ["copy-html"], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/client/index.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source(paths.finalBundle))
        .pipe(gulp.dest(paths.finalDest));
});
*/