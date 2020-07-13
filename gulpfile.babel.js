import gulp from 'gulp'
import plumber from 'gulp-plumber'
import pug from 'gulp-pug'
import browserSync from 'browser-sync'
import sass from 'gulp-dart-sass'


import watch from 'gulp-watch'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import buffer from 'vinyl-buffer'
import minify from 'gulp-minify'
import imagemin from 'gulp-imagemin'
import sitemap from 'gulp-sitemap'
import cachebust from 'gulp-cache-bust'
import tildeImporter from 'node-sass-tilde-importer'

/* imports postCss */
import postcss from "gulp-postcss"
import zIndex from "postcss-zindex"
import pseudoelements from "postcss-pseudoelements"
import nthChild from "postcss-nth-child-fix"
import cssnano from 'cssnano'

const server = browserSync.create()

const startServer = () => (
  server.init({
    server: {
      baseDir: './public'
    }
  })
)

const sassOptionsDev = {
  includePaths: ["./node_modules"],
  sourceComments: true,
  outputStyle: "expanded",
  importer: tildeImporter,
}

const sassOptionsProd = {
  includePaths: ["./node_modules"],
  outputStyle: "compressed",
  sourceComments: false,
  importer: tildeImporter,
}

const postCssPlugins = [
  zIndex(),
  pseudoelements(),
  nthChild(),
  cssnano({
    core: true,
    zindex: false,
    autoprefixer: {
      add: true,
      browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
    }
  })
]



gulp.task('styles-dev', () => {
  return gulp.src('./src/scss/styles.scss')
    .pipe(sourcemaps.init({ loadMaps : true}))
    .pipe(plumber())
    .pipe(sass(sassOptionsDev))
    .pipe(postcss(postCssPlugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/static/css/'))
    .pipe(server.stream({match: '**/*.css'}))
})


gulp.task('styles-build', () => {
  return gulp.src('./src/scss/styles.scss')
    .pipe(plumber())
    .pipe(sass(sassOptionsProd))
    .pipe(postcss(postCssPlugins))
    .pipe(gulp.dest('./public/static/css/'))
})

gulp.task('pug-dev', () => (
  gulp.src('./src/pug/index.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
      basedir: './src/pug'
    }))
    .pipe(gulp.dest('./public'))
))

gulp.task('pug-build', () => (
  gulp.src('./src/pug/index.pug')
    .pipe(plumber())
    .pipe(pug({
      basedir: './src/pug',
      pretty: true,
    }))
    .pipe(gulp.dest('./public'))
))

gulp.task('scripts-dev', () => (
  browserify('./src/js/index.js')
    .transform(babelify, {
      global: true // permite importar desde afuera (como node_modules)
    })
    .bundle()
    .on('error', function (err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(minify({
      ext: {
        src: '-min.js',
        min: '.js'
      }
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/static/js'))
))

gulp.task('scripts-build', () => (
  browserify('./src/js/index.js')
    .transform(babelify, {
      global: true // permite importar desde afuera (como node_modules)
    })
    .bundle()
    .on('error', function (err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(minify({
      ext: {
        src: '.js',
        min: '-min.js'
      }
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/static/js'))
))

gulp.task('images-build', () => {
  return gulp.src('./src/img/**/**')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('./public/static/img'))
})

gulp.task('images-dev', () => {
  return gulp.src('./src/img/**/**')
    .pipe(gulp.dest('./public/static/img'))
})

gulp.task('sitemap', () => {
  return gulp.src('./public/**/*.html', {
    read: false
  })
    .pipe(sitemap({
      siteUrl: 'https://example.com' // remplazar por tu dominio
    }))
    .pipe(gulp.dest('./public'))
})


gulp.task('cache', () => {
  return gulp.src('./public/**/*.html')
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest('./public'))
})


gulp.task('build', gulp.series(gulp.parallel(['styles-build', 'pug-build', 'scripts-build', 'images-build', 'cache', 'sitemap'])))


gulp.task('dev', gulp.parallel( gulp.series(['styles-dev', 'pug-dev', 'scripts-dev', 'images-dev'])), () => {

  gulp.series('styles-dev')
  gulp.series('scripts-dev')
  gulp.series('pug-dev')
  gulp.series('images-dev')

})



gulp.task("default", () => {
   server.init({
    server: {
      baseDir: './public'
    }
  })
  
  watch('./src/scss/**/**',gulp.series('styles-dev')).on("change", server.reload)
  watch('./src/js/**/**', gulp.series('scripts-dev')).on("change", server.reload)
  watch('./src/pug/**/**', gulp.series('pug-dev')).on("change", server.reload)
  watch('./src/img/**/**').on("add", gulp.series('images-dev'))
  })


