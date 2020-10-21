const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask(){
  return src('app/scss/style.scss', { sourcemaps: true })
      .pipe(sass())
      .pipe(postcss([cssnano()]))
      .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask(){
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync
function browserSyncServe(cb){
  browsersync.init({
    server: {
      baseDir: '.'
    }    
  });
  cb();
}

function browserSyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('*.html', browserSyncReload);
  watch(['app/**/*.scss', 'app/**/*.js'], series(scssTask, jsTask, browserSyncReload));
}

// Default Gulp Task
exports.default = series(
  scssTask,
  jsTask,
  browserSyncServe,
  watchTask
);