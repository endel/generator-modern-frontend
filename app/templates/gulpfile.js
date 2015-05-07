/*global -$ */
'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var through2 = require('through2');
var browserify = require('browserify');

gulp.task('stylesheet', ['sprites'], function () {
  return gulp.src('app/css/main<%= cssExtension %>')
    .pipe($.sourcemaps.init())<% if (cssPreprocessor == "sass") { %>
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))<% } else if (cssPreprocessor == "stylus") { %>
    .pipe($.stylus({
      import: ['sprites/*'], // auto-import sprite files
      errors: true
    }))<% } else if (cssPreprocessor == "less") { %>
    .pipe($.less())<% } %>
    .on('error', function (error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/css'))
    .pipe(reload({stream: true}));
});

gulp.task('sprites', function() {
  var spritesPath = 'app/images/sprites';
  var identifiers = fs.readdirSync(spritesPath).filter(function(spritePath) {
    var stat = fs.statSync(spritesPath + '/' + spritePath);
    return stat.isDirectory();
  });

  for (var i = 0; i < identifiers.length; i++) {
    var spriteData = gulp.src(spritesPath + '/' + identifiers[i] + '/*.png').pipe($.spritesmith({
      imgName: 'sprite_' + identifiers[i] + '.png',
      cssName: identifiers[i] + '.<%= cssExtension %>',
      imgPath: '../images/sprite_' + identifiers[i] + '.png',
      cssFormat: '<%= cssPreprocessor %>'
    }));

    // Pipe image stream
    spriteData.img
      .pipe(gulp.dest('.tmp/images'))
      .pipe(gulp.dest('dist/images'))

    // Pipe CSS stream
    spriteData.css
      .pipe(gulp.dest('app/css/sprites'));
  }
});

gulp.task('javascript', function () {
  return gulp.src('app/js/main.js')
    .pipe(through2.obj(function (file, enc, next){ // workaround for https://github.com/babel/babelify/issues/46
      browserify(file.path)
      .transform('babelify')
      .bundle(function(err, res){
        if (err) { return next(err); }

        file.contents = res;
        next(null, file);
      });
    }))
    .on('error', function (error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(gulp.dest('dist/js'))
    .pipe($.sourcemaps.init())
    // .pipe($.uglify())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/js'));
});

gulp.task('jshint', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['stylesheet'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app/*.html', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['stylesheet', 'javascript', 'fonts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/js/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/css/**/*<%= cssExtension %>', ['stylesheet']);
  gulp.watch('app/js/**/*.js', ['javascript']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;
<% if (cssPreprocessor !== "none") { %>
  gulp.src('app/css/*<%= cssExtension %>')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/css'));
<% } %>
  gulp.src('app/*.html')
    .pipe(wiredep({
      // exclude: ['bootstrap-sass-official'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['jshint', 'javascript', 'stylesheet', 'html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
