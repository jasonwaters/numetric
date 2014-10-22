var gulp = require('gulp'),
	jshint = require('gulp-jshint');




gulp.task('jslint', function() {
	gulp.src('./js/*.js')
		.pipe(jshint())
		// You can look into pretty reporters as well, but that's another story
		.pipe(jshint.reporter('default'));
});