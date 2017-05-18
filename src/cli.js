#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import {
    countFiles,
    EXCLUDED_FILES,
    EXCLUDED_DIRECTORIES,
} from './index';

const list = (value = '') => {
    return value.split(',');
};

let dirVal = './';

program
    .version('0.1.1')
    .arguments('[dir]')
    .option('-f, --exclude-files [excludeFiles]', 'File names or patterns used to exclude files from the count.', list)
    .option('-d, --exclude-dirs [excludeDirs]', 'Directory names or patterns used to exclude directories from the count.', list)
    .option('-v, --verbose', 'Log the file names in addition to the files total.')
    .action((dir) => {
        dirVal = dir;
    })
    .parse(process.argv);

const totalFiles = countFiles({
    dir: path.join(process.cwd(), dirVal),
    count: 0,
    excludeFiles: program.excludeFiles || EXCLUDED_FILES,
    excludeDirs: program.excludeDirs || EXCLUDED_DIRECTORIES,
    includeLogs: program.verbose ? false : true,
    verbose: program.verbose,
});

if (program.verbose) {
    console.log(`Total files: ${totalFiles}`);
}

console.log('\n');
