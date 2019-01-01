const gulp = require("gulp");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const webserver = require("gulp-webserver");
const cleanCss = require("gulp-clean-css");
const fs = require("fs")
const url = require("url")
const path = require("path")
const list = require("./data/list.json")


//编译sass
gulp.task("sass", function() {
    return gulp.src("./src/scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css"))
})

gulp.task("watch", function() {
    return gulp.watch("./src/scss/**/*.scss", gulp.series("sass"))
})

gulp.task("webserver", function() {
    return gulp.src("src")
        .pipe(webserver({
            port: 8089,
            open: true,
            livereload: true,
            middleware: function(req, res, next) {

                var pathname = url.parse(req.url).pathname
                if (pathname == "/favicon.ico") {
                    return res.end()
                }
                if (pathname === "/api/list") {
                    console.log(list)
                    res.end(JSON.stringify({ code: 0, data: list }))
                } else {
                    pathname = pathname == "/" ? "index.html" : pathname
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
                }
            }
        }))
})

gulp.task("bsass", function() {
    return gulp.src("./src/scss/**/*.scss")
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(gulp.dest("./dist/css"))
})

gulp.task("js", function() {
    return gulp.src("./src/js/**/*.js")
        .pipe(concat("bulid.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"))
})
gulp.task("img", function() {
    return gulp.src("./src/img/**/*.{jpg,png,gif,jpeg}")
        .pipe(imagemin())
        .pipe(gulp.dest("./dist/img"))
})
gulp.task("html", function() {
    return gulp.src("./src/**/*.html")
        .pipe(htmlmin({
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest("./dist/"))
})

gulp.task("dev", gulp.series("sass", "webserver", "watch"))
gulp.task("build", gulp.parallel("bsass", "js", "img", "html"))