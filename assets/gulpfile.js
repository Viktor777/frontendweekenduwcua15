var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    //concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    compass = require('gulp-compass'),
    //sourcemaps = require('gulp-sourcemaps'),
    paths = {
        javascripts: [
            'javascripts/app/*.js', 'javascripts/helpers/*.js', 'javascripts/config/*.js'
        ],
        images: 'images/*.{png,jpg,gif}',
        test: ['gulpfile.js', 'javascripts/app/*.js', 'javascripts/helpers/*.js', 'javascripts/config/*.js'],
        sass: 'sass/**/*.{sass,scss}'
    };

gulp.task('js', function() {
    gulp.src('javascripts/config/main.js')
        .pipe(browserify({
            debug: true
        }))
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest('javascripts'))
});

//gulp.task('minify', function () {
//    gulp.src(paths.javascripts)
//        .pipe(sourcemaps.init())
//        .pipe(concat('scripts.min.js'))
//        .pipe(uglify())
//        .pipe(sourcemaps.write('./'))
//        .pipe(gulp.dest('javascripts'));
//});

gulp.task('image', function () {
    gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('images'));
});

gulp.task('test', function () {
    gulp.src(paths.test)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('compass', function () {
    gulp.src(paths.sass)
        .pipe(compass({
            config_file: 'config.rb',
            css: 'stylesheets'
        }))
        .pipe(gulp.dest('stylesheets'));
});

gulp.task('watch', function() {
    gulp.watch(paths.javascripts, ['js']);
    gulp.watch(paths.sass, ['compass']);
});

gulp.task('default', ['js', 'image']);