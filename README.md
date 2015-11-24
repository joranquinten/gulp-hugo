Gulp-boilerplate
=======

A barebones, standardized boilerplate for developing and testing a web project.

---

## Introduction

This package build a default environment for front end development on a Windows-machine. This results in some minor changes in relation to online documentation, which is mostly Unix/OS X oriented. The package makes some basic assumptions regarding the use of development tools en task order. It is built upon Gulp and several Node modules. Gulp is very customizable and makes use of streams (performance is therefore much better than Grunt, which uses the file system).

The process is built around four main tasks: production, development and unit testing as well as end to end testing. These tasks call other, more specific tasks.
The production and development tasks take files as input ('src' folder), process them, and place them in a designated folder. By default, these folders are called 'dev' and 'prod'. These folders are set up in the configuration file '**gulp-config.json**' and mirror the folder structure of the 'src' folder.

### Dependencies

* [Node.js](https://nodejs.org/en/)
* [Ruby](http://rubyinstaller.org/) 2.2.3-p173-x64 (Sass-compiling, optional when replaced with PostCSS modules)
* [Selenium Standalone server](http://www.seleniumhq.org/download/) (e2e testing, automated install via Node Package Manager)
* [Git](https://git-scm.com/download/win) (optional, for cloning the boilerplate)

### Installation

After installing the dependencies, installation should be as simple as cloning a repository to your local machine and running from the terminal: **npm install**. You could test this by running the four separate main tasks: **gulp dev**, **gulp prod**, **gulp unit**, **gulp e2e**. If any errors occur, check if all modules exist in package.json. Install omitted modules with the **--save-dev** flag, to at least update your own **package.json**.

### Configuration

The package is built around three main tasks: developing, deploying for production and testing:

### Developing
During development, you should have the 'dev' task running (command: **gulp dev**). This will monitor changes you make to files and trigger the browsersync process, to reflect your changes. Javascript and Sass files will be linted on the fly, but will be compiled in the same task.
When unit tests are written, you probably want another terminal open, in which you run the unit tests during development (command: **gulp unit**). Any new files added to the structure, require a restart of the 'dev' task.

### Testing
Besides the unit testing, the protractor plugin allows running end to end tests. These should not have to be run in tandem with a development process, but will serve as a automated test before any deployment (command: **gulp e2e**).

### Deploying for production
Production (command: **gulp prod**) should follow the development process and is used to compile the source ('src' folder) to a production environment. The main difference is that all assets will be minified.

### Deploying to Cordys

With copying files to certain directories, it should be possible to deploy a production environment directly into Cordys. This would require some more research&hellip;

---

## Components

The package consists of a dozen and more individual plugins. I will address some of them here (alphabetically), the rest can be considered as a generic plugin and/or helper.

* [autoprefixer](https://github.com/postcss/autoprefixer), [cssgrace](https://github.com/cssdream/cssgrace), [cssnano](https://github.com/ben-eb/cssnano), [postcss-pseudoelements](https://www.npmjs.com/package/postcss-pseudoelements) are PostCSS modules, which transform plain CSS to match the specifications.
* [browser-sync](http://www.browsersync.io/): synchronizes changes to files directly into the browser. Multiple browsers are possible and input in any browser is synchronized to the other windows.
* [gulp-filter](https://www.npmjs.com/package/gulp-filter), [gulp-if](https://www.npmjs.com/package/gulp-if), [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins), [gulp-notify](https://www.npmjs.com/package/gulp-notify), [gulp-plumber](https://www.npmjs.com/package/gulp-plumber) and [gulp-util](https://www.npmjs.com/package/gulp-util) are helpers to simplify the gulpfile and tasks.
* [gulp-postcss](https://www.npmjs.com/package/gulp-postcss) facilitates the use of PostCSS plugins
* [gulp-sass](https://www.npmjs.com/package/gulp-sass) is a wrapper for node-sass, libsass, Sass (in that order) and is therefore a bit delicate with dependencies. Sass and [gulp-scss-lint](https://www.npmjs.com/package/gulp-scss-lint) would preferably be obsolete, but frameworks such as [Bootstrap](http://getbootstrap.com/) and [Foundation](http://foundation.zurb.com/) still make use of Sass as of now. Remove with caution. The configuration of the linter is stored in **lint-scss.yml** in the root of the project.
_Note: Sass linting the may cause an overflow of errors, if imported directly into *.scss_
* All of the Jasmine, Karma, Protractor and Launchers are installed on behalf of the testing tasks. I loosely followed [this article](http://jbavari.github.io/blog/2014/06/11/unit-testing-angularjs-services/) for the unit testing, and [these](http://mherman.org/blog/2015/04/09/testing-angularjs-with-protractor-and-karma-part-1/) [articles](http://mherman.org/blog/2015/04/26/testing-angularjs-with-protractor-and-karma-part-2) for [setting up](http://thejackalofjavascript.com/end-to-end-testing-with-protractor/) the e2e testing.

### Tasks (order of appearance)

The configuration file should make it easier to modify the input, output and options of the tasks. Each task which touches files, addresses them via a function (pathFiles), which joins the base-folder with the separate filenames.
_Note: tasks by default do not track the creation or deletion of files!_

#### default
This is the task which automatically gets called with the "gulp" command. Fires up the development-task by default.

#### dev
This is the default task, and it assumes that it will involve manipulating the front end components (js, css, html, images). It runs the develop-build tasks for those components and continues to watch these files for any change.
It also, by default, starts up the browser(s) as defined in the gulp-config.json file.

#### prod
This task is exactly similar to the dev-task. The difference is that the global variable isDevelop is set to false before executing the tasks, which enables some extra options, specifically suited for a production environment (think uglifying the assets).

#### js
This tasks builds designated Javascript-files, concatenates them and (if production is set) uglifies the files. Javascript files which are required to be enclosed in the header, can be defined as 'critical' files. These files will be processed separately. By default, these files will not be linted (the package assumes this to be third party libraries, i.e. modernizr or similar libraries). Sourcefiles for either process have to be defined in gulp-config.json.
Any change causes an automatic browser reload.

#### css

The build assumes you will want to end up with only one CSS file and makes no distinction between critical and non critical CSS.
The source are .scss files, which will be linted as sass-files. The sass-files will be transpiled and concatenated to a singles CSS-file. The CSS-file is then modified by several PostCSS plugins, which mainly validate against ie8 or higher. A non development task will minify the CSS before saving. Any change causes an automatic browser change. The browserSync plugin should only inject edited CSS, not reload the current page.

The CSS task may be modified, it currently contains sort of a hybrid between Sass-compiling and PostCSS modules, especially since PostCSS has very Sass-like capabilities, without the Ruby dependency. [It would probably be more efficient to port Sass-compiling to PostCSS.](http://benfrain.com/breaking-up-with-sass-postcss/)

#### html
This is a fairly simple task: it copies all HTML-like files (html,htm,xml,txt) to the working directory ('dev' or 'prod'). The production task will also minify the HTML files. Any change causes an automatic browser reload.

#### img
The images task takes image-like files (gif,png,jpeg,jpg,svg), minifies them automatically and places them in an 'img' folder.

#### unit
This is one to the two types of testing tasks. This task is configured to output its results in the terminal and should therefore be run in a separate terminal (this task should be run in tandem with the 'dev' or 'prod' tasks). The task starts a Karma webserver and custom browser in which the tests are validated. The Karma webserver follows a certain format for the config file. The specific config is found in the 'tests' folder: **unit.karma.conf.js**.

At the moment, a PhantomJS browser is used to validate the unit tests. A preconfigured Chrome browser is available, but disabled. The files (both test as js files) are being watched continuously and trigger a rerun of the tests on change. The task is configured to support Jasmine.

#### e2e
This is the end to end testing task. This task fires up a browser and performs instructed user input to validate against the written tests. This is not a task intend for continuous use and should be run before any deployment. The task starts a standalone Selenium server, opens a new browsers and starts automating the test instructions. This plugin follows a certain config file as well, which is located in the 'tests' folder: **e2e.protractor.conf.js**.

Due to security restraints on my device, I was unable to trigger these tests on Google Chrome and are therefore being triggered via Firefox.

#### serve
This task facilitates the browserSync plugin. The current setup assumes a local webserver is already in place. BrowserSync could also be configured to act as as standalone webserver for static files (disabled in the Gulpfile.js).

#### watch
The watch task defines which files are being watched by the taskrunner and what action should be triggers on change. The task is configured to trigger the 'js', 'css', 'html' or 'img' task, corresponding to a file change within the scope of these tasks.

---

## Resources

* [GulpJS](http://gulpjs.com/)
* [Node.js](https://nodejs.org/en/)
* [PhantomJS](http://phantomjs.org/)
* [Jasmine](http://jasmine.github.io/) ([2.3](http://jasmine.github.io/2.3/introduction.html))
* [Karma](http://karma-runner.github.io/0.13/index.html)
* [Protractor](https://angular.github.io/protractor/#/)
* [Selenium](http://www.seleniumhq.org/)

---

## Remarks

Python ([2.7.10](https://www.python.org/downloads/release/python-2710/) 64-bit) was installed during development process of this package. It _should_ not be necessary. The package has been fully tested with Python not installed.

---

## Todo

* Watch task for the creation and deletion of new files
* Extend the main config file with several loose lines in existing files
* Implement gzip
* [Replace Sass completely with PostCSS modules](https://pawelgrzybek.com/from-sass-to-postcss/)
* Deploy directly into Cordys

---

Author: Joran Quinten
