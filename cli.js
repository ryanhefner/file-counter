#!/usr/bin/env node
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var list = function list() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return value.split(',');
};

var dirVal = './';

_commander2.default.version('0.1.1').arguments('[dir]').option('-f, --exclude-files [excludeFiles]', 'File names or patterns used to exclude files from the count.', list).option('-d, --exclude-dirs [excludeDirs]', 'Directory names or patterns used to exclude directories from the count.', list).option('-v, --verbose', 'Log the file names in addition to the files total.').action(function (dir) {
    dirVal = dir;
}).parse(process.argv);

var totalFiles = (0, _index.countFiles)({
    dir: _path2.default.join(process.cwd(), dirVal),
    count: 0,
    excludeFiles: _commander2.default.excludeFiles || _index.EXCLUDED_FILES,
    excludeDirs: _commander2.default.excludeDirs || _index.EXCLUDED_DIRECTORIES,
    includeLogs: _commander2.default.verbose ? false : true,
    verbose: _commander2.default.verbose
});

if (_commander2.default.verbose) {
    console.log('Total files: ' + totalFiles);
}

console.log('\n');