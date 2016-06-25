# Gilp

[![travis][travis-image]][travis-url]
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]

Gulp tasks for git hooks.

## Define a hook

```javascript
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var gilp = require('gilp')(gulp);

gilp.hook('pre-commit', function () {
  return gilp.srcFromStaged(['**/*.js']) 
    .pipe(eslint())
    .pipe(eslint.failAfterError());
});
```

## Install defined hooks (.git/hooks)

```bash
npm run gulp gilp-install
```

##  Get a stream of files to be committed

```javascript
  gilp.srcFromStaged();
```
##  Get a stream of files from a commit

```javascript
  gilp.srcFromCommit('e3bca34');
```

## Read git hook's parameters

```javascript
  gilp.getArgs();
```

## Get current branch

```javascript
  gilp.getBranch();
```

## Run a task on the CI to check the commit

```javascript
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var gilp = require('gilp')(gulp);

gulp.task('check-commit', function () {
  return gilp.srcFromCommit('e3bca34', ['**/*.js']) 
    .pipe(eslint())
    .pipe(eslint.failAfterError());
});
```

[travis-image]: https://img.shields.io/travis/sophilabs/gilp.svg?style=flat-square
[travis-url]: https://travis-ci.org/sophilabs/gilp
[npm-image]: https://img.shields.io/npm/v/gilp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gilp
[downloads-image]: https://img.shields.io/npm/dm/gilp.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/gilp
