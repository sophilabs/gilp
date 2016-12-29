'use strict';
const  gulp = require('gulp');
const  filter = require('gulp-filter');
const  combiner = require('stream-combiner2').obj;
const  gilp = require('gilp')(gulp);
const  print = require('gulp-print');

const  eslint = require('gulp-eslint');
const  flake8 = require('gulp-flake8');
const  mergeConflict = require('gilp-merge-conflict');
const  checkCommit = require('gilp-check-commit');
const  checkBranchName = require('gilp-check-branch-name');
const  checkGrep = require('gulp-check-grep');
const  lintFilepath = require('gulp-lint-filepath');

function js() {
  var src = filter([
    'app/**/*.js',
    'app/node_modules/**',
    '!app/**/vendor/**',
    '!app/assets/**'
  ], {restore: true});
  return combiner(
    src,
    print(),
    lintFilepath({'file-name': [/(^|\/)[a-z0-9\.-]+\.js$/]}),
    lintFilepath.reporter(),
    eslint(),
    eslint.format(),
    eslint.failAfterError(),
    checkGrep(/console\.log(.(?!noqa$))+$/gm, {message: 'console.log'}),
    checkGrep(/debugger$(.(?!noqa$))+$/gm, {message: 'debugger'}),
    checkGrep.failOnError(),
    src.restore
  );
}

function py() {
  var src = filter(['app/**/*.py'], {restore: true});
  return combiner(
    src,
    print(),
    lintFilepath({'file-name': [/(^|\/)[a-z_0-9]+\.py$/]}),
    lintFilepath.reporter(),
    flake8('.flake8'),
    flake8.failOnError(),
    checkGrep(/datetime\.now\(\)/g, {message: 'Replace datetime.now by timezone.now'}),
    checkGrep(/gettext/g, {message: 'Remove i18n'}),
    checkGrep(/print\((.(?!noqa$))+$/gm, {message: 'print call'}),
    checkGrep.failOnError(),
    src.restore
  );
}

function html() {
  var src = filter(['app/**/*.html'], {restore: true});
  return combiner(
    src,
    print(),
    lintFilepath({'file-name': [/(^|\/)[a-z0-9\-]+\.html$/]}),
    lintFilepath.reporter(),
    checkGrep(/{\%\s+load\s+i18n\s+\%\}/g, {message: 'Remove i18n'}),
    checkGrep(/\{\%\s+trans\s+[^%]+/g, {message: 'Remove trans tags'}),
    checkGrep(/\{\%\s+block\s+[a-z0-9_]*[A-Z\-]+[a-z0-9_]*/g, {message: 'Use snake_case for block tags'}),
    checkGrep.failOnError(),
    src.restore
  );
}

gilp.hook('pre-commit', function() {
  return gilp.srcFromStaged(['./app/**/*'])
    .pipe(js())
    .pipe(py())
    .pipe(html())
    .pipe(checkBranchName({
      allow: [/^(dev-([0-9]+|NA)-[a-z0-9_]+)$/, 'hotfix'],
      disallow: [/^dev$/, '^master$']
    }))
    .pipe(mergeConflict())
    .pipe(mergeConflict.failOnError());
});

gilp.hook('commit-msg', function() {
  return gilp.srcFromStaged(['**/*'])
    .pipe(checkCommit(/^(NA|[0-9]+)\:\s[A-Z0-9].*\.$/gm, 'Invalid commit message format: Example > 4566: First letter in uppercase and end with a period.\n'
    ));
});
