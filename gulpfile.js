'use strict';

var gulp = require('gulp'),
	pump = require('pump'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean');

gulp.task('selector', function() {
	return gulp.src('src/selector.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(gulp.dest('dist'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});

gulp.task('default', ['clean'], function() {
	gulp.start('selector');
});

gulp.task('watch', function() {
	gulp.watch('src/selector.js', ['selector']);
});
