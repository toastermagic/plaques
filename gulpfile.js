var gulp = require("gulp");
var ts = require("gulp-typescript");

var vendor = [
    "./node_modules/es6-shim/es6-shim.min.js",
    "./node_modules/systemjs/dist/system-polyfills.js",
    "./node_modules/systemjs/**/dist/system.src.js",
    "./node_modules/rxjs/**/bundles/Rx.js",
    "./node_modules/es6-promise/**/dist/es6-promise.js",
    "./node_modules/angular2/**/bundles/angular2.dev.js",
    "./node_modules/angular2/**/bundles/router.dev.js",
    "./node_modules/angular2/**/bundles/http.dev.js",
    "./node_modules/ng2-material/**/dist/font.css",
    "./node_modules/ng2-material/**/dist/ng2-material.css"
];

var copyOnly = [
    "./node_modules/angular2-jwt/angular2-jwt.js",
    "./node_modules/ng2-material/dist/ng2-material.js",
    "./node_modules/ng2-material/dist/MaterialIcons-Regular.eot",  
    "./node_modules/ng2-material/dist/MaterialIcons-Regular.ttf",  
    "./node_modules/ng2-material/dist/MaterialIcons-Regular.woff",  
    "./node_modules/ng2-material/dist/MaterialIcons-Regular.woff2"  
];

var tsProject = ts.createProject("src/tsconfig.json");

gulp.task("watch:server", ["ts-babel"], function () {
    gulp.watch("./server/**/*.ts", ["ts-babel"]);
});

gulp.task("watch:src", ["build:src"], function () {
    gulp.watch("./src/**/*.css", ["copyCss"]);
    gulp.watch("./src/**/*.html", ["copyHtml", "injectVendor"]);
    gulp.watch("./src/**/*.ts", ["compile-ts", "credentials"]);
});

gulp.task("build:src", ["transformJade", "copyHtml", "copyCss", "injectVendor"]);

gulp.task("build", ["build:ng", "ts-babel"]);

gulp.task("compile-ts", function () {
    var sourcemaps = require("gulp-sourcemaps");

    var tsResult = tsProject.src(["./src/**/*.ts"])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/wwwroot"));
});

gulp.task("transformJade", function() {
    var jade = require("gulp-jade");

    return gulp.src(["./src/**/*.jade"])
        .pipe(jade())
        .pipe(gulp.dest("./dist/wwwroot/"));
})

gulp.task("build:ng", function(cb) {
    var exec = require('child_process').exec;

    exec('ng build -o dist/wwwroot', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task("copyHtml", function () {
    return gulp.src(["./src/index.html"]).pipe(gulp.dest("./dist/wwwroot/"));
});

gulp.task("copyCss", function () {
    return gulp.src(["./src/css/*.css"]).pipe(gulp.dest("./dist/wwwroot/css"));
});

gulp.task("injectVendor", ["copyHtml"], function () {
    var inject = require("gulp-inject");
    
    var vendorStream = gulp.src(vendor)
        .pipe(gulp.dest("./dist/wwwroot/vendor"));

    // copy only - do not inject
    gulp.src(copyOnly)
        .pipe(gulp.dest("./dist/wwwroot/vendor"));

    return gulp.src("./dist/wwwroot/index.html")
        .pipe(inject(vendorStream, { relative: true }))
        .pipe(gulp.dest("./dist/wwwroot"));
});

gulp.task("ts-babel", function () {
    var babel = require("gulp-babel");
    var rename = require("gulp-rename");
    // Using my existing tsconfig.json file

    var tsProject = ts.createProject('./server/tsconfig.json');
 
    // The `base` part is needed so
    //  that `dest()` doesnt map folders correctly after rename
    return gulp.src(["server/**/*.ts", "!server/typings/**/*"], { base: "./" })
        .pipe(ts(tsProject))
        // .pipe(babel({
            
        // }, { cwd: 'server' }))
        // .pipe(rename(function (path) {
        //     path.extname = ".js";
        // }))
        .pipe(gulp.dest("./dist"));
});