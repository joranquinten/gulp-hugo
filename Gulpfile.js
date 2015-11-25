require('es6-promise').polyfill();
var config = require('./gulp-config.json');
var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({ pattern: ['gulp-*', 'gulp.*'], replaceString: /\bgulp[\-.]/ });
var runSequence = require('run-sequence');
var pngquant = require('imagemin-pngquant');
var gulpif = require('gulp-if');
var del = require('del');
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

// Testing plugins
var karmaServer = require('karma').Server;
var protractor = require("gulp-protractor").protractor;

// PostCSS Plugins
var autoprefixer = require('autoprefixer');
var cssgrace = require('cssgrace');
var pseudoelements = require('postcss-pseudoelements');

// Assuming default means develop
gulp.task('default', function() {
  runSequence('dev');
});

gulp.task('dev', function(){
  config.settings.isDevelop = true;
  runSequence(['js','css','html','img'],'serve','watch');
});

gulp.task('dev:nowatch', function(){
  config.settings.isDevelop = true;
  runSequence(['js','css','html','img']);
});

gulp.task('prod', function(){
  config.settings.isDevelop = false;
  runSequence(['js','css','html','img'],'serve','watch');
});

gulp.task('prod:nowatch', function(){
  config.settings.isDevelop = false;
  runSequence(['js','css','html','img']);
});

gulp.task('prod:test', function(){
  runSequence('prod:nowatch','e2e');
});

/*
Tasks by type
*/
gulp.task('js',function(){

  var path = config.env.dev;
  if (!config.settings.isDevelop) path = config.env.prod;
  var base = path.base, ref = config.sourceFiles.jsCritical;

  if (config.settings.cleanBeforeRun) {
    del([ path.dest + ref ]);
  }

  gulp.src( pathFiles(base, ref) )
    .pipe(plugins.filter('**/*.js'))
    .pipe(plugins.plumber({ handleError: function (err) {console.log(err);this.emit('end');} }))
    //.pipe(plugins.jshint())
    //.pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.concat('critical.js'))
    .pipe(gulpif(!config.settings.isDevelop, plugins.uglify()))
    .pipe(gulpif(!config.settings.isDevelop, plugins.stripDebug()))
    .pipe(gulp.dest(path.dest+'js/'))
    .pipe(reload({stream: true}));

  ref = config.sourceFiles.js;

  if (config.settings.cleanBeforeRun) {
    del([ path.dest + ref ]);
  }

  return gulp.src( pathFiles(base, ref) )
    .pipe(plugins.filter('**/*.js'))
    .pipe(plugins.plumber({ handleError: function (err) {console.log(err);this.emit('end');} }))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.concat('app.js'))
    .pipe(gulpif(!config.settings.isDevelop, plugins.uglify()))
    .pipe(gulpif(!config.settings.isDevelop, plugins.stripDebug()))
    .pipe(gulp.dest(path.dest+'js/'))
    .pipe(reload({stream: true}));
});

gulp.task('css', function(){

  var path = config.env.dev;
  if (!config.settings.isDevelop) path = config.env.prod;
  var base = path.base, ref = config.sourceFiles.scss;

  if (config.settings.cleanBeforeRun) {
    del([ path.dest + config.sourceFiles.css ]);
  }

  // Define PostCSS plugins
  var processors = [
    autoprefixer({browsers: ['ie 8-10', 'Last 2 Chrome versions']}),
    cssgrace,
    pseudoelements
  ];

  return gulp.src( pathFiles(base, ref) )
    .pipe(plugins.filter('**/styles.s+(a|c)ss'))
    .pipe(plugins.plumber({ handleError: function (err) {console.log(err);this.emit('end');} }))
    .pipe(plugins.scssLint(config.plugins.scssLint))
    .pipe(plugins.sass())
    .pipe(plugins.concat('styles.css'))
    //.pipe(plugins.uncss({ html: pathFiles(base, config.sourceFiles.html) })) // UnCSS cleans up unused CSS code, but relies on (static) HTML files in order to extract identifiers, might be interesting for thinning out frameworks.
    .pipe(plugins.postcss(processors)) // ♤ PostCSS ♤
    .pipe(gulpif(!config.settings.isDevelop, plugins.minifyCss({compatibility: 'ie8'})))
    .pipe(gulp.dest(path.dest + 'css/'))
    .pipe(reload({stream: true}));
});

gulp.task('html', function(){

  var path = config.env.dev;
  if (!config.settings.isDevelop) path = config.env.prod;
  var base = path.base, ref = config.sourceFiles.html;

  if (config.settings.cleanBeforeRun) {
    del([ path.dest + ref ]);
  }

  return gulp.src( pathFiles(base, ref) )
    .pipe(plugins.filter('*.{html,htm,xml,txt}'))
    .pipe(plugins.plumber({ handleError: function (err) {console.log(err);this.emit('end');} }))
    .pipe(gulpif(!config.settings.isDevelop, plugins.htmlmin( config.plugins.minifyHTML )))
    .pipe(gulp.dest(path.dest+'/'))
    .pipe(reload({stream: true}));
});

gulp.task('img', function(){

  var path = config.env.dev;
  if (!config.settings.isDevelop) path = config.env.prod;
  var base = path.base, ref = config.sourceFiles.images;

  if (config.settings.cleanBeforeRun) {
    del([ path.dest + ref ]);
  }

  return gulp.src( pathFiles(base, ref) )
    .pipe(gulpif(!config.settings.isDevelop, plugins.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))) // Minify only on prod
    .pipe(gulp.dest(path.dest+'img/'));
});

/* **************************************************
*  Tests                                            *
************************************************** */

gulp.task('unit', function(done){

  notify('Starting unit tests. Note that this follow a watch pattern on testfiles, press Ctrl+C to quit.','title');

  var path = config.env.dev;
  var base = path.base, ref = config.sourceFiles.tests.unit;

  		  new karmaServer({
  		    configFile: __dirname + '/src/tests/unit.karma.conf.js',
  		    singleRun: false
  		  }, done).start();

});

gulp.task('e2e', function(){

  var path = config.env.dev;
  var base = path.base, ref = config.sourceFiles.tests.e2e;

  gulp.src( pathFiles(base, ref) )
      .pipe(protractor({
          configFile: __dirname + '/src/tests/e2e.protractor.conf.js',
          args: ['--baseUrl', 'http://127.0.0.1:8000']
      }))
      .on('error', function(err) {
        this.emit('end'); //instead of erroring the stream, end it
      });

  notify('Starting end to end tests. Note that this starts up a browser and could take a while, press Ctrl+C to quit.','title');
});

/*
Utilities
*/
gulp.task('serve', function(){
  var env = 'dev';
  if (!config.settings.isDevelop) env = 'prod';

  notify('Serve assumes you have a local webserver running and content is accessible via localhost.','title');
  // Assumes you have a local webserver running and content is accessible via localhost by default
  browserSync.init({server: false, proxy: 'localhost/'+ currentDir() +'/'+ env, browser: config.plugins.browserSync.browsers });

  // Use static server:
  // browserSync.init({server: { baseDir: './' }, browser: config.plugins.browserSync.browsers });

});

gulp.task('watch', function(){

  var path = config.env.dev;
  var base = path.base;

  plugins.watch(base+''+config.watchFiles.scss, function () {
    gulp.run(['css']);
  });

  plugins.watch(base+''+config.watchFiles.js, function () {
    gulp.run(['js']);
  });

  plugins.watch(base+''+config.watchFiles.html, function () {
    gulp.run(['html']);
  });

  plugins.watch(base+''+config.watchFiles.images, function () {
    gulp.run(['img']);
  });

});

gulp.task('clean:dev', function(){
  return del([ config.env.dev.dest ]);
});

gulp.task('clean:prod', function(){
  return del([ config.env.prod.dest ]);
});

/* Other helpers */
function currentDir(){
  if (__dirname) return __dirname.split('\\').pop();
}

function notify(msg,type){
  if (typeof(plugins.util) !== undefined){
      switch(type){
        case 'warning':
          plugins.util.log(plugins.util.colors.yellow(msg));
        break;
        case 'error':
          plugins.util.log(plugins.util.colors.bgRed(msg));
        break;
        case 'success':
          plugins.util.log(plugins.util.colors.green(msg));
        break;
        case 'title':
          plugins.util.log(plugins.util.colors.blue(msg));
        break;
        default:
          plugins.util.log(plugins.util.colors.cyan(msg));
      }
  } else {
    if (type !== undefined) msg = '['+ type +']: ' + msg;
    console.log(msg);
  }
}

function pathFiles(base, collection){
 if (typeof(collection) === 'object') {
 var ar = []; for (var i=0; i< collection.length; i++){ ar.push( base +''+ collection[i] ); } return ar;
 } else if (typeof(collection) === 'string') {
   return base +''+ collection;
 }
}
