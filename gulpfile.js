const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();


let paths = {
    styles: {
        src: './src/sass/**/*.sass',
        dest: './app/css/'
    },
    scripts: {
        src: './src/js/main.js',
        static: [
            './src/js/particles.min.js',
        ],
        dest: './app/js/'
    }
};


function clean() {
    return del(['./app/*']);
}


function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}


function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}



function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch("*.html", browserSync.reload);
}


gulp.task('build', gulp.series(clean,
                    gulp.parallel(styles, scripts)));


function static() {
    return gulp.src(paths.scripts.static)
            .pipe(gulp.dest(paths.scripts.dest));
}


exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;


exports.default = gulp.series('build', static, watch);