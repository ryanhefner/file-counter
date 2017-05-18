'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.countFiles = exports.EXCLUDED_DIRECTORIES = exports.EXCLUDED_FILES = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * File names that are excluded by default
 */
var EXCLUDED_FILES = exports.EXCLUDED_FILES = ['.DS_Store', '.DS_Store?', '.Spotlight-V100', '.Trashes', 'ehthumbs.db', 'Thumbs.db'];

/**
 * Directories that are excluded by default
 */
var EXCLUDED_DIRECTORIES = exports.EXCLUDED_DIRECTORIES = ['.git', 'node_modules', 'vendor'];

var stream = process.stderr;
/**
 * Log status to terminal while processing
 *
 * @param {string} value
 */
var log = function log(value) {
    stream.clearLine();
    stream.cursorTo(0);
    stream.write(value);
};

/**
 * Check content to see if it matches a rule literal or regular expression
 *
 * @param {string} content
 * @param {array} rules
 * @return bool
 */
var contentMatch = function contentMatch(content, rules) {
    return rules.find(function (rule) {
        return new RegExp(rule).test(content);
    }) !== undefined;
};

/**
 * Iterate through a directory and return the count for all files within the
 * the directory recursively.
 *
 * @param {Object} options
 * @param {Number} count
 * @return Number
 */
var countFiles = exports.countFiles = function countFiles(_ref) {
    var dir = _ref.dir,
        _ref$excludeFiles = _ref.excludeFiles,
        excludeFiles = _ref$excludeFiles === undefined ? EXCLUDED_FILES : _ref$excludeFiles,
        _ref$excludeDirs = _ref.excludeDirs,
        excludeDirs = _ref$excludeDirs === undefined ? EXCLUDED_DIRECTORIES : _ref$excludeDirs,
        _ref$includeLogs = _ref.includeLogs,
        includeLogs = _ref$includeLogs === undefined ? false : _ref$includeLogs,
        _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose;
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var contents = _fs2.default.readdirSync(dir);
    var files = contents.filter(function (content) {
        try {
            var stats = _fs2.default.statSync(_path2.default.join(dir, content));
            return stats && !stats.isDirectory() && !contentMatch(content, excludeFiles);
        } catch (err) {
            return false;
        }
    });
    var directories = contents.filter(function (content) {
        try {
            var stats = _fs2.default.statSync(_path2.default.join(dir, content));
            return stats && stats.isDirectory() && !contentMatch(content, excludeDirs);
        } catch (err) {
            return false;
        }
    });

    count += files.length;

    if (verbose) {
        files.forEach(function (file) {
            var slash = dir.slice(-1);
            console.log(slash === '/' ? '' + dir + file : dir + '/' + file);
        });
    }

    if (includeLogs) {
        log('Total files: ' + count);
    }

    if (directories.length) {
        directories.forEach(function (directory) {
            count = countFiles({
                dir: dir + '/' + directory,
                excludeFiles: excludeFiles,
                excludeDirs: excludeDirs,
                includeLogs: includeLogs,
                verbose: verbose
            }, count);
        });
    }

    return count;
};