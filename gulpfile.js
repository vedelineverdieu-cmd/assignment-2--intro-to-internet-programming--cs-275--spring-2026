const { src, dest, series, watch } = require('gulp');
const CSSLinter = require('gulp-stylelint');
const { deleteAsync } = require('del');
const babel = require('gulp-babel');
const htmlCompressor = require('gulp-htmlmin');
const jsCompressor = require('gulp-terser');
const jsLinter = require('gulp-eslint');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));

const reload = browserSync.reload;

// Development
let lintCSS = () => {
    return src('styles/**/*.css')
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [{ formatter: 'string', console: true }]
        }));
};

let lintJS = () => {
    return src('js/*.js')
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach('compact'));
};

let transpileJSForDev = () => {
    return src('js/*.js')
        .pipe(babel())
        .pipe(dest('temp/js'));
};

let serve = () => {
    browserSync.init({
        notify: true,
        reloadDelay: 50,
        browser: "chrome",
        server: {
            baseDir: './'
        }
    });

    watch('js/*.js', series(lintJS, transpileJSForDev)).on('change', reload);
    watch('styles/**/*.css').on('change', reload);
    watch('*.html').on('change', reload);
    watch('img/**/*').on('change', reload);
};

// Production 
let compressHTML = () => {
    return src('*.html')
        .pipe(htmlCompressor({ collapseWhitespace: true }))
        .pipe(dest('prod'));
};

let compileCSSForProd = () => {
    return src('styles/main.scss')
        .pipe(sass.sync({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(dest('prod/styles'));
};

let copyUnprocessedAssetsForProd = () => {
    return src([
        `dev/*.*`,             // Source all files,
        `dev/**`,              // and all folders,
        `!dev/html/`,          // but not the HTML folder
        `!dev/html/*.*`,       // or any files in it
        `!dev/html/**`,        // or any sub folders;
        `!dev/img/`,           // ignore images;
        `!dev/img/.gitignore`, // ignore .gitignore;
        `!dev/**/*.js`,        // ignore JS;
        `!dev/styles/**`       // and, ignore Sass/CSS.
    ], {dot: true})
        .pipe(dest(`prod`));
};

async function clean() {
    await deleteAsync(['./temp', './prod']);
}

exports.serve = series(
    lintCSS,
    lintJS,
    transpileJSForDev,
    serve
);

exports.build = series(
    clean,
    compressHTML,
    compileCSSForProd,
    copyUnprocessedAssetsForProd);

exports.default = exports.serve;