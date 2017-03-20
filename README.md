# Gilp

[![travis][travis-image]][travis-url]
[![coverage][coveralls-image]][coveralls-url]
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]
[![js-semistandard-style][semi-image]][semi-url]
[![license][license-image]][license-url]
[![dependencies][dependencies-image]][dependencies-url]
[![dev-dependencies][dev-dependencies-image]][dev-dependencies-url]

Git has a lot of hooks for client and server side but the most used and known 
hook is pre-commit, where you can run some validations (like linters) and cancel 
a commit if something fails. Gilp is a tool to define (using gulp tasks), install 
and run hooks.

## Why gilp over gulp?

There are 2 main reasons:

- The regular pre-commit hook managers run using the local file's content instead 
  of git staged content. Gulp comes with `vinyl`, a virtual file format where we 
  can create an in-memory version of a file to use as content for the tasks. Like 
  `gulp.src`, we created a new stream provider for that: `srcFromStaged`. If we 
  need to run the same tools but over a `commit`, `branch` or `tag` instead 
  (e.g. in a CI), you can do it using `srcFromCommit` without a `checkout`.

- Gulp is plenty of plugins ready to use, 
  [just check it](https://www.npmjs.com/browse/keyword/gulpplugin).

## Yarn, please.

We recommend to use `yarn` instead of `npm` because the error report is less verbose 
when `gulp` returns a non-zero code (on error) so we can focus on the "real" error.


## Installation

```bash
yarn add --dev gilp
```

## Usage

You can use any [gulp](https://www.npmjs.com/browse/keyword/gulpplugin) or 
[gilp](https://www.npmjs.com/browse/keyword/gilpplugin) plugin.

### Define a hook

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

**  Get a stream of files to be committed: **

```javascript
  gilp.srcFromStaged();
```

**  Get a stream of files from a commit: **

```javascript
  gilp.srcFromCommit('e3bca34');
```

### Install defined hooks (.git/hooks)

```bash
yarn run gulp gilp-install
```

To auto-install the hooks after `yarn` installation, add in your `package.json` the 
following `postinstall` command:

```javascript
{
  // ...
  "scripts": {
    // ...
    "gulp": "gulp",
    "postinstall": "gulp gilp-install"
  },
  // ...
}
```

### Run a task on the CI to check the commit

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

## Example

See full working [example](examples/full.js).


## License

Gilp is Copyright (c) 2016 sophilabs, inc. It is free software, and may be
redistributed under the terms specified in the [license] file.

## About

[![sophilabs][sophilabs-image]][sophilabs-url]

Gilp is maintained and funded by sophilabs, inc. The names and logos for
sophilabs are trademarks of sophilabs, inc.

[license]: /LICENSE
[sophilabs-image]: https://s3.amazonaws.com/sophilabs-assets/logo/logo_300x66.gif
[sophilabs-url]: https://sophilabs.co
[travis-image]: https://img.shields.io/travis/sophilabs/gilp.svg?style=flat-square
[travis-url]: https://travis-ci.org/sophilabs/gilp
[npm-image]: https://img.shields.io/npm/v/gilp.svg?style=flat-square
[npm-url]: https://npmjs.org/packge/gilp
[downloads-image]: https://img.shields.io/npm/dm/gilp.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/gilp
[semi-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[semi-url]: https://github.com/Flet/semistandard
[coveralls-image]: https://img.shields.io/coveralls/sophilabs/gilp.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/sophilabs/gilp?branch=master
[license-image]: https://img.shields.io/github/license/sophilabs/gilp.svg?style=flat-square
[license-url]: /LICENSE
[dependencies-image]: https://david-dm.org/sophilabs/gilp.svg?style=flat-square
[dependencies-url]: https://david-dm.org/sophilabs/gilp
[dev-dependencies-image]: https://david-dm.org/sophilabs/gilp/dev-status.svg?style=flat-square
[dev-dependencies-url]: https://david-dm.org/sophilabs/gilp#info=devDependencies
