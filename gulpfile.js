var gulp = require('gulp'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint')
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css');;

gulp.task('jslint', function() {
	gulp.src('./js/*.js')
		.pipe(jshint())
		// You can look into pretty reporters as well, but that's another story
		.pipe(jshint.reporter('default'));
});

gulp.task('less', function () {
	gulp.src('./css/**/*.less')
		.pipe(less())
		.pipe(minifyCSS())
		.pipe(gulp.dest('./css'));
});


gulp.task('watch', function() {
	gulp.watch('./css/**/*.less', function() {
		gulp.run('less');
	});

	gulp.watch('./js/**/*.js', function() {
		gulp.run('jslint');
	});
});

gulp.task('default', ['jslint', 'less']);
