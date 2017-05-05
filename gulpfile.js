var gulp = require('gulp'),
		sass = require('gulp-sass'),
		browserSync = require('browser-sync'),
		autoprefixer = require('gulp-autoprefixer'),
		rename = require('gulp-rename'),
		sourcemaps = require('gulp-sourcemaps'),
		rigger = require('gulp-rigger'),
		wiredep = require('wiredep').stream;

var uglifyjs = require('uglify-js');
var minifier = require('gulp-uglify/minifier');
var pump = require('pump');

gulp.task('compress', function (cb) {
  // the same options as described above
  var options = {
    preserveComments: 'license'
  };

  pump([
      gulp.src('./assets/js/include.js'),
      minifier(options, uglifyjs),
			rename(function (path) {
				path.basename += ".min";
			}),
      gulp.dest('./assets/js/')
    ],
    cb
  );
});



gulp.task('bower', function () {
  gulp.src('./src/partials/inc-bottom.html')
    .pipe(wiredep({
      directory: "./bower_components/"
    }))
    .pipe(gulp.dest('./src/partials/'));
});


// ... variables
var autoprefixerOptions = {
	browsers: ['last 2 versions', '> 5%', 'Firefox ESR', 'ie >= 10']
};

var output = './';

gulp.task('html', function () {
	return gulp.src('./src/*.html')
		.pipe(rigger())
		.pipe(gulp.dest(output))
		.pipe(browserSync.reload({stream:true}));
});


gulp.task('css', function () {
	return gulp.src('./assets/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(gulp.dest(output))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('browser-sync', function() {
	browserSync.init(null, {
		server: {
			baseDir: output
		}
	});
});

gulp.task('bs-reload', function () {
	browserSync.reload();
});

gulp.task('default', ['html', 'css', 'browser-sync'], function () {
	gulp.watch("./assets/scss/**/*.scss", ['css']);
	gulp.watch("./src/**/*.html", ['html']);
	gulp.watch("./assets/js/*.js", ['bs-reload']);
	gulp.watch('bower.json', ['bower']);
});

gulp.task('release', function () {
	return gulp.src('./assets/scss/**/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(gulp.dest(output))
});
