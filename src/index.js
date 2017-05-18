import fs from 'fs';
import path from 'path';

/**
 * File names that are excluded by default
 */
export const EXCLUDED_FILES = [
    '.DS_Store',
    '.DS_Store?',
    '.Spotlight-V100',
    '.Trashes',
    'ehthumbs.db',
    'Thumbs.db',
];

/**
 * Directories that are excluded by default
 */
export const EXCLUDED_DIRECTORIES = [
    '.git',
    'node_modules',
    'vendor',
];

const stream = process.stderr;
/**
 * Log status to terminal while processing
 *
 * @param {string} value
 */
const log = (value) => {
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
const contentMatch = (content, rules) => {
    return rules.find((rule) => {
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
export const countFiles = ({
    dir,
    excludeFiles = EXCLUDED_FILES,
    excludeDirs = EXCLUDED_DIRECTORIES,
    includeLogs = false,
    verbose = false,
}, count = 0) => {
    const contents = fs.readdirSync(dir);
    const files = contents.filter((content) => {
        try {
            const stats = fs.statSync(path.join(dir, content));
            return stats
                && !stats.isDirectory()
                && !contentMatch(content, excludeFiles);
        }
        catch (err) {
            return false;
        }
    });
    const directories = contents.filter((content) => {
        try {
            const stats = fs.statSync(path.join(dir, content));
            return stats
                && stats.isDirectory()
                && !contentMatch(content, excludeDirs);
        }
        catch (err) {
            return false;
        }
    });

    count += files.length;

    if (verbose) {
        files.forEach((file) => {
            const slash = dir.slice(-1);
            console.log(slash === '/' ? `${dir}${file}` : `${dir}/${file}`);
        });
    }

    if (includeLogs) {
        log(`Total files: ${count}`);
    }

    if (directories.length) {
        directories.forEach((directory) => {
            count = countFiles({
                dir: `${dir}/${directory}`,
                excludeFiles,
                excludeDirs,
                includeLogs,
                verbose,
            }, count);
        });
    }

    return count;
};
