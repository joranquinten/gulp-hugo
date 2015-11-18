/*
gulp-autoprefixer -> or postCSS?
gulp-babel -> transpile?
gulp-gzip -> compress
gulp-postcss -> prefix
gulp-prompt -> dev/prod?
gulp-rename -> minify
gulp-beautify -> dev?
*/

require('es6-promise').polyfill();
var config = require('./gulp-config.json');
var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({ pattern: ['gulp-*', 'gulp.*'], replaceString: /\bgulp[\-.]/ });
var runSequence = require('run-sequence');
var pngquant = require('imagemin-pngquant');
var gulpif = require('gulp-if');
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

// Assuming default means develop
gulp.task('default', function() {
  runSequence('dev');
});

gulp.task('dev', function(){
  config.isDevelop = true;
  runSequence(['js','css','html','img'],'serve','watch');
});
gulp.task('prod', function(){
  config.isDevelop = false;
  runSequence(['js','css','html','img'],'serve','watch');
});

/*
Tasks by type
*/
gulp.task('js',function(){

  var path = config.env.dev;
  var base = path.base, ref = config.sourceFiles.jsCritical;
  if (!config.isDevelop) path = config.env.prod;

  gulp.src( pathFiles(base, ref) )
    .pipe(plugins.filter('**/*.js'))
    .pipe(plugins.plumber({ handleError: function (err) {console.log(err);this.emit('end');} }))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.concat('critical.js'))
    .pipe(gulpif(!config.isDevelop, plugins.uglify()))
    .pipe(gulpif(!config.isDevelop, plugins.stripDebug()))
    .pipe(gulp.dest(path.dest+'js/'))
    .pipe(reload({stream: true}));

  ref = config.sourceFiles.js;

  return gulp.src( pathFiles(base, ref) )
    .pipe(plugins.filter('**/*.js'))
    .pipe(plugins.plumber({ handleError: function (err) {console.log(err);this.emit('end');} }))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.concat('app.js'))
    .pipe(gulpif(!config.isDevelop, plugins.uglify()))
    .pipe(gulpif(!config.isDevelop, plugins.stripDebug()))
    .pipe(gulp.dest(path.dest+'js/'))
    .pipe(reload({stream: true}));
});

gulp.task('css', function(){

var path = config.env.dev;
var base = path.base, ref = config.sourceFiles.scss;
if (!config.isDevelop) path = config.env.prod;

  return gulp.src( pathFiles(base, ref) )
    .pipe(plugins.filter('**/styles.s+(a|c)ss'))
    .pipe(plugins.plumber({ handleError: function (err) {console.log(err);this.emit('end');} }))
    .pipe(plugins.scssLint(config.plugins.scssLint))
    .pipe(plugins.sass())
    .pipe(plugins.concat('styles.css'))
    .pipe(gulpif(!config.isDevelop, plugins.minifyCss( config.plugins.minifyCSS )))
    .pipe(gulp.dest(path.dest + 'css/'))
    // ♤ Insert PostCSS here? ♤
    .pipe(reload({stream: true}));
});

gulp.task('html', function(){

  var path = config.env.dev;
  var base = path.base, ref = config.sourceFiles.html;
  if (!config.isDevelop) path = config.env.prod;

  return gulp.src( pathFiles(base, ref) )
    .pipe(plugins.filter('*.{html,htm,xml,txt}'))
    .pipe(plugins.plumber({ handleError: function (err) {console.log(err);this.emit('end');} }))
    .pipe(gulpif(!config.isDevelop, plugins.htmlmin( config.plugins.minifyHTML )))
    .pipe(gulp.dest(path.dest+'/'))
    .pipe(reload({stream: true}));

});

gulp.task('img', function(){

  var path = config.env.dev;
  var base = path.base, ref = config.sourceFiles.images;
  if (!config.isDevelop) path = config.env.prod;

  return gulp.src( pathFiles(base, ref) )
    .pipe(gulpif(!config.isDevelop, plugins.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))) // Minify only on prod
    .pipe(gulp.dest(path.dest+'img/'));

});

/*
Utilities
*/
gulp.task('serve', function(){
  var env = 'dev';
  if (!config.isDevelop) env = 'prod';
  browserSync.init({server: false, proxy: 'localhost/'+ currentDir() +'/'+ env, browser: config.plugins.browserSync.browsers });
});

gulp.task('watch', function(){

  var path = config.env.dev;
  var base = path.base;
  gulp.watch(base+''+config.watchFiles.scss, ['css']);
  gulp.watch(base+''+config.watchFiles.js, ['js']);
  gulp.watch(base+''+config.watchFiles.html, ['html']);
});

/* Other helpers */
function currentDir(){
  if (__dirname) return __dirname.split('\\').pop();
}

function pathFiles(base, collection){
 if ((typeof(collection) === 'array') || (typeof(collection) === 'object')) {
 var ar = []; for (var i=0; i< collection.length; i++){ ar.push( base +''+ collection[i] ); } return ar;
 } else if (typeof(collection) === 'string') {
   return base +''+ collection;
 }
}