const File = require('vinyl');
const execSync = require('child_process').execSync;
const gulpFilter = require('gulp-filter');
const gulpIf = require('gulp-if');
const streamify = require('stream-array');
const stripBomBuf = require('strip-bom-buf');
const through2 = require('through2');
const util = require('util');
const gilpUtil = require('gilp-util');

const hooks = [
  'pre-commit',
  'pre-push',
  'commit-msg'
];

function Gilp (gulp) {
  const gilp = this;
  this._gulp = gulp;
  this._installed = [];
  this._gulp.task('gilp-install', function (callback) {
    const installed = gilp._installed.concat();
    const saveNext = function (err) {
      if (err) {
        return callback(err);
      }
      const hook = installed.shift();
      if (hook === undefined) {
        return callback();
      }
      gilpUtil.installHook(hook, saveNext);
    };
    saveNext();
  });
}

Gilp.prototype.hook = function (name, dep, fn) {
  if (hooks.indexOf(name) === -1) {
    throw new Error(util.format('Unsupported hook: %s', name));
  }

  if (!fn && typeof dep === 'function') {
    fn = dep;
    dep = undefined;
  }
  dep = dep || [];
  fn = fn || function () {};

  this._installed.push(name);
  this._gulp.task(util.format('gilp-%s', name), dep, fn);
};

Gilp.prototype._getStream = function (objectFormat, paths, glob, includeBOM) {
  return streamify(paths)
    .pipe(through2.obj(function (path, enc, callback) {
      const contents = execSync(util.format('git cat-file blob %s', util.format(objectFormat, path)));
      const file = new File({
        gilp: true,
        path: path,
        contents: includeBOM ? contents : stripBomBuf(contents)
      });
      this.push(file);
      callback();
    }))
    .pipe(gulpIf(glob !== undefined, gulpFilter(glob || [])));
};

Gilp.prototype.srcFromStaged = function (glob, includeBOM) {
  return this._getStream(
    ':0:%s',
    execSync('git diff --cached --name-only --diff-filter=ACM')
      .toString()
      .trim()
      .split('\n')
      .filter(function (path) { return path !== ''; }),
    glob,
    includeBOM
  );
};

Gilp.prototype.srcFromCommit = function (commit, glob, includeBOM) {
  return this._getStream(
    util.format('%s:%%s', commit),
    execSync(util.format('git diff --name-only --diff-filter=ACM %s^ %s', commit, commit))
      .toString()
      .trim()
      .split('\n')
      .filter(function (path) { return path !== ''; }),
    glob,
    includeBOM
  );
};

module.exports = function (gulp) {
  return new Gilp(gulp);
};
