# file-counter
Recursively counts the number of files within a directory, and all of its subdirectories.
Apply filters to exclude files or directories from the total.

## Install
`file-counter` can be used as either a command line utility or included in your
projects or scripts where you need to know the number of files within a directory.

### CLI
Install globally so you can run the `file-counter` command via the command line
within a directory to get the total number of files within that directory and all
sub-directories.

Via [npm](https://www.npmjs.com):

`npm install -g file-counter`

### `countFiles` Method
If you need to get the total number of files for a task progress bar, or you’re
evaluating the number of files within a directory for maintenance purposes within
another script, you can use the `countFiles` method.

Via [npm](https://www.npmjs.com):

`npm install file-counter`

Via [yarn](https://yarnpkg.com):

`yarn add file-counter`

## How to use
You can use `file-counter` two different ways, as a command line utility or as a
utility for use within your package or project. Below are a few examples on how
you can use it in those scenarios.

### CLI


```
$ file-counter [options] [dir]
```

#### Options
The following options are available both for the CLI use of `file-counter`, as
well as for the `countFiles` method. Please note that when using the `--exclude-*`,
or `excludeDirs`, options that the defaults will no longer be applied.

##### Exclude Files - `-f, --exclude-files [...files]`
Depending on what you’re doing, you may find the need to exclude certain files
from the total that is returned. You can do that by including a comma separated
list of file names or regular expressions to exclude from the count tally.

By default, the following files are excluded from totals:

* `.DS_Store`
* `.DS_Store?`
* `.Spotlight-V100`
* `.Trashes`
* `ehthumbs.db`
* `Thumbs.db`

Here’s an example of using the `-f`, or `--exclude-files`, option:

Exlude any `.DS_Store` file and all Javascript (`*.js`) files:
```
$ file-counter -f '.DS_Store,(.*).js'
```

##### Exclude Directories - `-d, --exclude-dirs [...directories]`
The same goes for directories. You can use either the exact directory name or a
regular expression to exclude directories, and their files, from being included
in the total count.

By default, the following directories are excluded from totals:

* `.git`
* `node_modules`
* `vendor`

Here are a few examples of using the `-d`, or `--exclude-dirs`, option:

Exclude `.git` and `node_modules` directories:
```
$ file-counter -d '.git,node_modules'
```

Exclude all directories (ie. only tally the files in the root directory):
```
$ file-counter -d '(.*)'
```

##### Verbose - `-v, --verbose`
Including the `--verbose` flag will output file names included in the total count.

```
$ file-counter -v
```

### `countFiles` Method
In addition to the command line utility, you can also use the method that the
utility relies on in your own projects and scripts where you would want to know
the number of files in a directory.

```
countFiles({...options}, count = 0)
```

*__Note:__ `count` is there because the method is recursively called while traversing
the directories. Please do _not_ prepopulate that argument unless you want to
increment/decrement the count by that value.

#### Options

```
countFiles({
    dir: '...',
    excludeFiles: ['...',],
    excludeDirs: ['...',],
    includeLogs: [true|false],
    verbose: [true|false],
})
```

Here’s an example where we use the `countFiles` method in combination with the
[progress](https://github.com/visionmedia/node-progress) package to show a progress
bar during the processing of a Node script.

```
import path from 'path';
import { countFiles } from 'file-counter';
import ProgressBar from 'progress';

const ROOT_DIR = path.join(__dirname, '../');
const totalFiles = countFiles({
    dir: ROOT_DIR,
});

const bar = new ProgressBar(':bar', { total: totalFiles });

...
(iterate over files, doing stuff)
bar.tick();
...
```

## License

[MIT](LICENSE)
