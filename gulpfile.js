const del = require('del');
const gulp = require('gulp');
const gulpNodemon = require('gulp-nodemon');
const rollup = require('rollup');
// const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupTypescript = require('rollup-plugin-typescript2');

function clean() {
  return del([
    './.rp2_cache/**',
    './bld/**',
    './dst/**'
  ])
}

function copy() {
  return gulp.src('./src/**.{css,html}')
    .pipe(gulp.dest('./bld'))
}

async function build() {
  const bundle = await rollup.rollup({
    input: 'src/main.ts',
    plugins: [
      rollupTypescript(/*{ plugin options }*/),
      // rollupCommonjs(),
      rollupNodeResolve()
    ]
  });

  await bundle.write({
    name: 'MemoryGame',
    file: 'bld/bundle.js',
    format: 'iife'
  });
}

function start() {
  gulpNodemon({
      script: './app.js',
      watch: './src',
      ext: 'ts js html',
      env: { 'NODE_ENV': 'development' },
      tasks: ['build']
  })
}

gulp.task('clean', clean)
gulp.task('build', gulp.series(copy, build))
// gulp.task('test', gulp.series('clean:all'))
gulp.task('start', start);
