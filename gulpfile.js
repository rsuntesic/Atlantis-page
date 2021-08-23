var gulp = require("gulp"),
    sass = require("gulp-sass"),
    cssnano = require("gulp-cssnano"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    babel = require("gulp-babel"),
    svgmin = require("gulp-svgmin"),
    svgstore = require("gulp-svgstore"),
    cheerio = require("gulp-cheerio"),
    path = require("path"),
    browserSync = require("browser-sync").create(),
    reload = browserSync.reload;
    var supported_browsers = [
        'last 3 versions',
        'Chrome > 37',
        'Firefox > 33',
        'Opera > 25',
        'not IE 9',
        'Edge >= 12',
        'Safari >= 6',
        'iOS >= 6',
    ];

gulp.task("build-css", function () {
    return gulp
        .src("sass/*")
        .pipe(sass().on("error", sass.logError))
        .pipe(cssnano({
            zindex: false,
            autoprefixer: {browsers: supported_browsers, add: true},
            reduceIdents: false
        }))
        .pipe(gulp.dest("css/"))
        .pipe(browserSync.stream());
    });

gulp.task('prettify', function() {
  return gulp.src(['./*.css', './*.html', './*.js'])
    .pipe(prettify({
      indent_size: 4,
      js: {
        indent_size: 4
      }
    }))
    .pipe(gulp.dest('./public'));
});


gulp.task("build-js-footer", function () {
    return gulp
        .src(["js-dev/dom-init.js", "js-dev/plugins/**/*.js", "js-dev/global.js", "js-dev/methods/**/*.js"])
        .pipe(concat("script.js"))
        .pipe(
            babel({
                presets: ["@babel/env"]
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest("js/"))
        .pipe(browserSync.stream());
});


gulp.task("build-svg-sprite", function () {
    var stream = gulp
        .src("img/svg/*.svg", { base: "sprite" })
        .pipe(
            svgmin(function (file) {
                var prefix = path.basename(file.relative, path.extname(file.relative));
                return {
                    plugins: [
                        {
                            cleanupIDs: {
                                prefix: prefix + "-",
                                minify: false
                            }
                        }
                    ]
                };
            })
        )
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(
            cheerio({
                run: function ($) {
                    $("svg").attr("style", "display: none!important");
                },
                parserOptions: { xmlMode: true }
            })
        )
        .pipe(gulp.dest("img/svg/"));
    return stream;
});

gulp.task("watch", function () {
    browserSync.init({
        proxy: 'localhost/atlantis',
        notify: false
    });
    gulp.watch("*.php").on("change", reload);
    gulp.watch('template/**/*.php').on('change', reload);
    gulp.watch("sass/*.scss", gulp.series("build-css"));
    gulp.watch("js-dev/**/*.js", gulp.series("build-js-footer"));
});