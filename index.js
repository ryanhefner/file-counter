'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.countFiles = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ROOT_DIR = _path2.default.join(__dirname);

var EXCLUDED_FILES = ['.DS_Store', '.gitattributes', '.gitignore', '.gitkeep'];

var EXCLUDED_DIRECTORIES = ['.git', 'node_modules', 'vendor'];

var stream = process.stderr;
var log = function log(value) {
    stream.clearLine();
    stream.cursorTo(0);
    stream.write(value);
};

var countFiles = exports.countFiles = function countFiles(dir) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var contents = _fs2.default.readdirSync(dir);
    var files = contents.filter(function (content) {
        try {
            var stats = _fs2.default.statSync(_path2.default.join(dir, content));
            return stats && !stats.isDirectory() && EXCLUDED_FILES.indexOf(content) === -1;
        } catch (err) {
            return false;
        }
    });
    var directories = contents.filter(function (content) {
        try {
            var stats = _fs2.default.statSync(_path2.default.join(dir, content));
            return stats && stats.isDirectory();
        } catch (err) {
            return false;
        }
    });

    // files.forEach((file) => {
    //     console.log(file);
    // });

    count += files.length;

    log('Total files: ' + count);

    if (directories.length) {
        directories.forEach(function (directory) {
            if (_fs2.default.statSync(_path2.default.join(dir, directory)).isSymbolicLink()) {
                return;
            }

            if (EXCLUDED_DIRECTORIES.indexOf(directory) === -1) {
                count = countFiles(dir + '/' + directory, count);
            }
        });
    }

    return count;
};

var list = function list(value) {
    return value.split(',');
};

var dirValue = void 0;

_commander2.default.version('0.1.0').arguments('[dir]').option('-xf', '--exclude-files [excludeFiles]', 'File names or patterns used to exclude files from the count.', list).option('-xd', '--exclude-dirs [excludeDirs]', 'Directory names or patterns used to exclude directories from the count.', list).action(function (dir) {
    dirValue = dir;
});

_commander2.default.parse(process.argv);

countFiles(_path2.default.join(process.cwd(), dirValue || './'));
console.log('\n');