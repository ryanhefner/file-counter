import fs from 'fs';
import path from 'path';
import parseArgs from 'minimist';
import program from 'commander';

const ROOT_DIR = path.join(__dirname);

const EXCLUDED_FILES = [
    '.DS_Store',
    '.gitattributes',
    '.gitignore',
    '.gitkeep',
];

const EXCLUDED_DIRECTORIES = [
    '.git',
    'node_modules',
    'vendor',
];

const stream = process.stderr;
const log = (value) => {
    stream.clearLine();
    stream.cursorTo(0);
    stream.write(value);
};

export const countFiles = (dir, count = 0) => {
    const contents = fs.readdirSync(dir);
    const files = contents.filter((content) => {
        try {
            const stats = fs.statSync(path.join(dir, content));
            return stats
                && !stats.isDirectory()
                && EXCLUDED_FILES.indexOf(content) === -1;
        }
        catch (err) {
            return false;
        }
    });
    const directories = contents.filter((content) => {
        try {
            const stats = fs.statSync(path.join(dir, content));
            return stats && stats.isDirectory();
        }
        catch (err) {
            return false;
        }
    });

    // files.forEach((file) => {
    //     console.log(file);
    // });

    count += files.length;

    log(`Total files: ${count}`);

    if (directories.length) {
        directories.forEach((directory) => {
            if (fs.statSync(path.join(dir, directory)).isSymbolicLink()) {
                return;
            }

            if (EXCLUDED_DIRECTORIES.indexOf(directory) === -1) {
                count = countFiles(`${dir}/${directory}`, count);
            }
        });
    }

    return count;
};

const list = (value) => {
    return value.split(',');
};

let dirValue;

program
    .version('0.1.0')
    .arguments('[dir]')
    .option('-xf', '--exclude-files [excludeFiles]', 'File names or patterns used to exclude files from the count.', list)
    .option('-xd', '--exclude-dirs [excludeDirs]', 'Directory names or patterns used to exclude directories from the count.', list)
    .action((dir) => {
        dirValue = dir;
    });

program.parse(process.argv);

countFiles(path.join(process.cwd(), dirValue || './'));
console.log('\n');
