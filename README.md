# Gilp

[![travis][travis-image]][travis-url]
[![coverage][coveralls-image]][coveralls-url]
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]
[![js-semistandard-style][semi-image]][semi-url]
[![license][license-image]][license-url]
[![dependencies][dependencies-image]][dependencies-url]
[![dev-dependencies][dev-dependencies-image]][dev-dependencies-url]

Gulp tasks for git hooks.

## Installation

```bash
npm install gilp
```

## Usage

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

### Install defined hooks (.git/hooks)

```bash
npm run gulp gilp-install
```

To auto-install the hooks after `npm install` add in your `package.json` the 
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

###  Get a stream of files to be committed

```javascript
  gilp.srcFromStaged();
```
###  Get a stream of files from a commit

```javascript
  gilp.srcFromCommit('e3bca34');
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
## License

Gilp is Copyright (c) 2016 sophilabs, inc. It is free software, and may be
redistributed under the terms specified in the [license] file.

## About

[![sophilabs][sophilabs-image]][sophilabs-url]

Gilp is maintained and funded by sophilabs, inc. The names and logos for
sophilabs are trademarks of sophilabs, inc.

[license]: /LICENSE
[sophilabs-image]: https://res.cloudinary.com/jsconfuy/image/upload/c_pad,f_auto,h_200,w_200,e_trim/v1426608244/xuwbunompvfjaxuazlwo.png
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
