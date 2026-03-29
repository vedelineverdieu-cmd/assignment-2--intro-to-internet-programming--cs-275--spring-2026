const { src, dest, series, watch } = require(`gulp`),
    CSSLinter = require(`gulp-stylelint`),
    { deleteAsync } = require(`del`),
    babel = require(`gulp-babel`),
    htmlCompressor = require(`gulp-htmlmin`),
    jsCompressor = require(`gulp-terser`),
    cssCompressor = require(`gulp-clean-css`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;

// Development
let lintJS = () => {
    return src(`js/main.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

// Development
let transpileJSForDev = () => {
    return src(`js/main.js`)
        .pipe(babel())
        .pipe(dest(`temp/js`));
};

// Production
let compressJS = () => {
    return src(`js/main.js`)
        .pipe(jsCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod/js`));
};

// Production
let compressHTML = () => {
    return src(`index.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

// Production
let compressCSS = () => {
    return src(`styles/main.css`)
        .pipe(cssCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod/styles`));
};

let copyUnprocessedAssetsForProd = () => {
    return src([
        `**/*`,                 // copy everything
        `!index.html`,
        `!styles/main.css`,
        `!js/**`,
        `!prod/**`,
        `!temp/**`,
        `!.gitignore`,
        `!package.json`,
        `!package-lock.json`,
        `!node_modules/**`
    ], { base: `.`, dot: true })
        .pipe(dest(`prod`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        server: {
            baseDir: [
                `temp`,
                `.`
            ]
        }
    });

    watch(`js/main.js`, series(lintJS, transpileJSForDev))
        .on(`change`, reload);

    watch(`styles/main.css`, lintCSS)
        .on(`change`, reload);

    watch(`img/**/*`)
        .on(`change`, reload);
};

async function clean() {
    const foldersToDelete = await deleteAsync([`./temp`, `prod`]);

    console.log(`The following directories were deleted:`, foldersToDelete);
}

// Development
let lintCSS = () => {
    return src(`styles/main.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
};

exports.lintJS = lintJS;
exports.lintCSS = lintCSS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressJS = compressJS;
exports.compressHTML = compressHTML;
exports.compressCSS = compressCSS;
exports.copyUnprocessedAssetsForProd = copyUnprocessedAssetsForProd;
exports.clean = clean;

exports.serve = series(
    lintJS,
    lintCSS,
    transpileJSForDev,
    serve
);

exports.build = series(
    compressJS,
    compressHTML,
    compressCSS,
    copyUnprocessedAssetsForProd
);

exports.default = exports.serve;