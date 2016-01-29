require('es6-promise').polyfill();

/* ****************************************************************************************************
*  Variables                                                                                          *
**************************************************************************************************** */

var confGlobal = require('./gulp/config/gulp-global.json');
var confPlugins = require('./gulp/config/gulp-plugins.json');

var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var del = require('del');
var pngquant = require('imagemin-pngquant');

/* ****************************************************************************************************
*                                                                                                     *
*  MAIN TASKS                                                                                         *
*                                                                                                     *
**************************************************************************************************** */

gulp.task('default', function() {
  gulp.run(['dev']);
});

gulp.task('dev', function(){
  confGlobal.isDevelop = true;
  runSequence(['js','css','copy:assets'], 'watch', 'hugo:server');
});

gulp.task('dev:nowatch', function(){
  confGlobal.isDevelop = true;
  runSequence(['js','css','copy:assets'], 'hugo:server');
});

gulp.task('dev:single', function(){
  confGlobal.isDevelop = true;
  runSequence(['js','css','copy:assets']);
});

gulp.task('prod', function(){
    confGlobal.isDevelop = false;
	runSequence('clean', ['js','css','copy:assets:minify'], 'css:clean', 'hugo:build');
});

gulp.task('prod:single', function(){
    confGlobal.isDevelop = false;
	runSequence('clean', ['js','css','copy:assets:minify'], 'css:clean', 'hugo:build');
});

/* ****************************************************************************************************
*                                                                                                     *
*  SUBTASKS                                                                                           *
*                                                                                                     *
**************************************************************************************************** */

gulp.task('js', function(){
	
    var sourcemaps = require('gulp-sourcemaps');

    return gulp.src('./source/**/*.js')
      .pipe(plugins.plumber({ handleError: function(err) { console.log(err); this.emit('end'); } }))
      .pipe(sourcemaps.init())
      .pipe(plugins.jshint(confPlugins.jshintOptions))
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.concat('app.js'))
      .pipe(gulpif(!confGlobal.isDevelop, plugins.uglify({ mangle: true })))
      .pipe(gulpif(!confGlobal.isDevelop, plugins.stripDebug()))
      .pipe(gulpif(confGlobal.enableGZIP, plugins.gzip(confPlugins.gzipOptions)))
      .pipe(sourcemaps.write('./static/assets/js/', { includeContent: false }))
      .pipe(gulp.dest('./static/assets/js/'));
});

gulp.task('css', function(){	
    var autoprefixer = require('autoprefixer');
    var cssgrace = require('cssgrace');
    var pseudoelements = require('postcss-pseudoelements');
	var cssnano = require('cssnano');
	
    var processors = [
      autoprefixer(confPlugins.autoprefixer),
      //cssgrace,
      pseudoelements
    ];
	
	if (!confGlobal.isDevelop) {
		processors = [
		  autoprefixer(confPlugins.autoprefixer),
		  //cssgrace,
		  pseudoelements,
		  cssnano
		 ];
	 }
	
	return gulp.src('./source/css/styles.scss')
      .pipe(plugins.plumber({ handleError: function(err) { console.log(err); this.emit('end'); } }))
      .pipe(plugins.scssLint(confPlugins.scssLint))
      .pipe(plugins.sass())
      .pipe(plugins.postcss(processors))
      .pipe(gulpif(confGlobal.enableGZIP, plugins.gzip(confPlugins.gzipOptions)))
      .pipe(gulp.dest('./static/assets/css/'));
});

gulp.task('css:clean', function(){
	console.log('Removing unused css styles...');
	return gulp.src('./public/css/styles.css')
      .pipe(gulpif(!confGlobal.isDevelop, plugins.uncss({ html: './public/**/*.html' })))
      .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function(){
	
	plugins.watch('./source/css/**/*.scss', function() {
	  console.log('Scss file changed, processing css...');
      gulp.run(['css']);
    });

    plugins.watch('./source/js/**/*.js', function() {
	  console.log('Javascript file changed, processing js...');
      gulp.run(['js']);
    });
	
});


/* ****************************************************************************************************
*                                                                                                     *
*  HELPERS                                                                                            *
*                                                                                                     *
**************************************************************************************************** */

gulp.task('copy:assets', function(){
	return gulp.src(['./source/assets/**/*.*','!./source/assets/js/*.*','!./source/assets/css/*.*'])
      .pipe(gulp.dest('./static/assets/'));
});

gulp.task('copy:assets:minify', function(){
	return gulp.src(['./source/assets/**/*.*','!./source/assets/js/*.*','!./source/assets/css/*.*'])
      .pipe(gulpif(!confGlobal.isDevelop, plugins.imagemin({
        progressive: true,
        svgoPlugins: [{
          removeViewBox: false
        }],
        use: [pngquant()]
      }))) // Minify only on prod
      .pipe(gulp.dest('./static/assets/'));
});

gulp.task('clean', function(){
	console.log('Deleting public folder...');
    return del('./public/');
});
	
gulp.task('hugo:server', plugins.shell.task([
    'hugo server -D=true'
]));
	
gulp.task('hugo:build', plugins.shell.task([
    'hugo'
]));