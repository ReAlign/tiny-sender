const gulp = require('gulp');
const all = require('gulp-all');

gulp.task('copy-npm', () =>
    all(
        gulp
            .src(['./dist/*.js'])
            .pipe(gulp.dest('./npm-public/dist')),
        gulp
            .src(['./package.json', './README.md'])
            .pipe(gulp.dest('./npm-public'))
    )
);