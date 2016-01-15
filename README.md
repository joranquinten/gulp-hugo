Gulp-boilerplate
=======

A barebones, standardized boilerplate for developing and testing a web project.

---

## Introduction

This package builds a default environment for front end development on a Windows-machine. This results in some minor changes in relation to available online documentation, which is mostly Unix/OS X oriented. The package makes some basic assumptions regarding the use of development tools en task order. It is built upon Gulp and several Node modules.

The process is built around four main tasks: production, development, testing (unit testing and end to end testing) and deployment. These tasks call other, more specific tasks.
The production and development tasks take files as input (source folder), process them, and place them in a designated folder. By default, these folders are called 'dev' and 'prod'. These folders are set up in the configuration file 'config/gulp-filemap.json' and mirror the folder structure of the 'src' folder.

### Contents

- [Dependencies](#markdown-header-dependencies)
- [Installation](#markdown-header-installation)
    - [Manual](#markdown-header-manual)
    - [Structure](#markdown-header-gulpfolder)
- [Configuration](#markdown-header-configuration)
- [Usage](#markdown-header-usage)
    - [Developing](#markdown-header-developing)
    - [Testing](#markdown-header-testing)
    - [Deploying for production](#markdown-header-deploying-for-production)
- [Components](#markdown-header-components)
- [Tasks](#markdown-header-tasks)
    - [Main tasks](#markdown-header-main-tasks)
    - [Task components](#markdown-header-task-components)
    - [Testing tasks](#markdown-header-testing-tasks)
    - [Utility tasks](#markdown-header-utility-tasks)
- [Resources](#markdown-header-resources)
- [Todo](#markdown-header-todo)

---
### Dependencies

The package needs some additional software to run. Gulp and its plugins are supported by Node.js. The rest of the software in this list is needed to perform certain tasks, but no primary tasks and could be neglected, based upon usage.

* [Node.js](https://nodejs.org/en/)
* [Gulp](https://gulpjs.com) (Install globally via npm: "**npm install gulp -g**")
* [Selenium Standalone server](http://www.seleniumhq.org/download/) (e2e testing, automated install via Node Package Manager)
* [Git](https://git-scm.com/download/win) (optional, for cloning the boilerplate)
* [Ruby](https://www.ruby-lang.org/en/documentation/installation/) is optional. The package is required solely for linting \*.scss files. gulp-scss-lint depends on Ruby to run. The alternative, gulp-sass-lint does not work with tabs in files. Sass linting is disabled by default.

### Installation

After installing the dependencies, installation should be as simple as cloning (or even downloading) a repository to your local machine and running: **npm install** from the terminal.

#### Manual

If npm is not supported (due to security limitations), follow these steps to reproduce the installation process. This involves manually copying certain folders from a local resource to the development environment.

* Run the default installation (cloning the repository and installing the modules locally)
* "Install" gulp globally by copying the "npm" folder to the target location: c:\Users\\*%Username%*\AppData\roaming\ (When using a machine as resource, the location would follow the same pattern.)
* Manually copy the folder "node_modules" from your project folder to the development environment

*Note: Earlier versions than node@3.0.0 used to nest node modules, which makes it nearly impossible to manipulate the node\_modules on Windows. This is fixed in later versions of node. It is recommended to update or install a recent version of node. This repo has been tested on node@4.2.3 and npm@2.14.7 *

#### Gulp-folder

The Gulpfile.js reads contents from seperate files in the "/gulp/"-folder. These are either configuration files or define the tasks which can be executed via the command line. This seperation keeps the Gulpfile as readable as possible. The files in the "/gulp/tasks/"-folder have a naming conventions which corresponds with the task from the Gulpfile. Each task is stored in a separate file.

### Configuration

All of the options are stored in the "/config/gulp-\*.json" files. These encompass source locations, target locations and certain configuration options which target plugins. **The "Gulpfile.js" should never have to be edited in order to use this repository for your development or even deployment.**

The config files are grouped by the following scope:

- **gulp-global.json** contains switches to control some global options within the tasks.
- **gulp-filemappings.json** stores file references of both source and target locations.
- **gulp-plugins.json** collects the options by plugin.
- **gulp-local.json** is used to overrule previous settings for a local development machine.

Short description of the main options:
- **isDevelop**: triggers minification of assets en determines the output folder (develop or production).
- **cleanBeforeRun**: deletes the previous output from a certain task.
- **cleanArchiveBeforeDeploy**: deletes all of the previously generated archives.
- **enableGZIP**: packs assets, server should support GZip when serving content.
- **enableUseref**: retrieves and concatenates assets based upon the marked blocks in the source HTML (see below).
- **enableRevisioning**: automagically adds a hash to the filenames of assets and updates the source HTML to load the generated filename. This facilitates browser caching and cache busting.
- **packageModules**: packages the source javascript files of app modules and stores the files in a concatenated (minified for production) \*.js file.
- **transformForAngular**: enables specific transformations of javascript files tailored to the Angular framework.

The useref-plugin relies on markup in the index.html file, in order to extract sourcefiles to concatenate and minify. This is applicable for \*.js as well as \*.css files. Additional information can be found at the [GitHub page](https://github.com/zont/gulp-usemin#blocks).

### Usage

The package is built around three main processes: developing, deploying for production and testing:

### Developing

During development, you should have the 'dev' task running (command: **gulp dev**). This will monitor changes you make to files and trigger the browsersync process, to reflect your changes. Javascript and Sass files will be linted on the fly, but will be compiled in the same task.
When unit tests are written, you probably want another terminal open, in which you run the unit tests during development (command: **gulp unit**). Any new files added to the structure, require a restart of the 'dev' task. Preferably, unit testing is embedded in the development process.

### Testing

Besides the unit testing, the protractor plugin allows running end to end tests. These should not have to be run in tandem with a development process, but will serve as a automated test before any deployment (command: **gulp e2e**).

Note: If Selenium is not properly updated via the install process, repeat the command in the terminal: **node node_modules/protractor/bin/webdriver-manager update**. A standalone .jar file should be stored in /node_modules/protractor/selenium/.

### Deploying for production

Production (command: **gulp prod** or **gulp prod:deploy**) should follow the development process and is used to compile the source ('src' folder) to a production environment. The main difference is that all assets will be minified. The difference with the ":deploy" suffix is the automated archiving of the output to a \*.zip archive.

---

## Components

The package consists of a dozen and more individual plugins. I will address some of them here (alphabetically), the rest can be considered as a generic plugin and/or helper.

* [autoprefixer](https://github.com/postcss/autoprefixer), [cssgrace](https://github.com/cssdream/cssgrace), [postcss-pseudoelements](https://www.npmjs.com/package/postcss-pseudoelements) are PostCSS modules, which transform plain CSS to match the specifications.
* [browser-sync](http://www.browsersync.io/): synchronizes changes to files directly into the browser. Multiple browsers are possible and input in any browser is synchronized to the other windows.
* [gulp-filter](https://www.npmjs.com/package/gulp-filter), [gulp-if](https://www.npmjs.com/package/gulp-if), [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins), [gulp-notify](https://www.npmjs.com/package/gulp-notify), [gulp-plumber](https://www.npmjs.com/package/gulp-plumber) and [gulp-util](https://www.npmjs.com/package/gulp-util) are helpers to simplify the gulpfile and tasks.
* [gulp-ng-annotate](https://www.npmjs.com/package/gulp-ng-annotate/) is used to automagically inject dependencies for AngularJS, as per suggestion of the [styleguide by John Papa](https://github.com/johnpapa/angular-styleguide#style-y092).
* [gulp-postcss](https://www.npmjs.com/package/gulp-postcss) facilitates the use of PostCSS plugins.
* [gulp-rev](https://github.com/sindresorhus/gulp-rev) is used to generate a cacheable version of assets.
* [gulp-useref](https://github.com/jonkemp/gulp-useref) is used to extract file locations from the html and store (and concatenate) these resources locally.
* [gulp-sass](https://www.npmjs.com/package/gulp-sass) is a wrapper for node-sass, libsass, Sass (in that order) and is therefore a bit delicate with dependencies. Sass and [gulp-scss-lint](https://www.npmjs.com/package/gulp-scss-lint) would be used to set up general styles. Frameworks such as [Bootstrap](http://getbootstrap.com/) and [Foundation](http://foundation.zurb.com/) still make use of Sass as of now.  The configuration of the linter is stored in **./config/lint-scss.yml** in the root of the project.
_Note: Sass linting the may cause an overflow of errors, when frameworks are imported directly into \*.scss. Linting is **disabled by default** because of the dependency of Ruby to run._
* All of the Jasmine, Karma, Protractor and Launchers are installed on behalf of the testing tasks. I loosely followed [this article](http://jbavari.github.io/blog/2014/06/11/unit-testing-angularjs-services/) for the unit testing, and [these](http://mherman.org/blog/2015/04/09/testing-angularjs-with-protractor-and-karma-part-1/) [articles](http://mherman.org/blog/2015/04/26/testing-angularjs-with-protractor-and-karma-part-2) for [setting up](http://thejackalofjavascript.com/end-to-end-testing-with-protractor/) the e2e testing.
*Important note: unit testing of AngularJS components relies on [ngMock](https://docs.angularjs.org/api/ngMock) in order to spoof requests.*

---

## Tasks (order of appearance)

The configuration file should make it easier to modify the input, output and options of the tasks. Each task which touches files, addresses them via a function (pathFiles), which joins the base-folder with the separate filenames.
_Note: tasks by default do not track the creation or deletion of files!_

### Main tasks

These are the tasks which should be called upon, although specific tasks may be called upon individually.

#### default
This is the task which automatically gets called with the "gulp" command. Fires up the development task (**dev**) by default.

#### dev
This is the default task, and it assumes that it will involve manipulating the front end assets (js, css, html, images). It deletes all previously generated assets and runs the development build tasks for those components and continues to watch these files for any change.
It also, by default, starts up the browser(s) as defined in the gulp-config.json file.

#### dev:nowatch
This task only performs the build actions of the dev task, with no automated browser loading en no watching of files.

#### prod
This task is exactly similar to the dev-task. The difference is that the global variable _isDevelop_ is set to _false_ before executing the tasks, which enables some extra options, specifically suited for a production environment (think uglifying the assets).

#### prod:nowatch
This task only performs the build actions of the prod task, with no automated browser loading en no watching of files.

#### prod:deploy
This task is a sibling of the prod:nowatch task: it build a clean production environment and outputs the contents in a \*.zip archive.

#### prod:test
This task runs the build process before performing the e2e test. It calls the prod:nowatch task, so no other automated tasks are running in the background.

#### clean:all
Cleans both development and production environments. This is irreversible. (Calls upon clean:dev and clean:prod.)

#### module:package
Packages and concatenates the javascript files in the designated module folder. The files get minified in the production environment. This enables accessing the modules from an external app.

### Task components

These tasks are used to read certain files, process them and output them to the desired folder ('develop' or 'production'). The configuration dictates if existing files will be deleted. The deleting process follows the sourceFiles pattern. This ensures only files generated by the scope of the task may be deleted.

#### js
This tasks builds designated Javascript-files, concatenates them and (if production is set) uglifies the files. Javascript files which are required to be enclosed at the top of the page, can be defined as 'critical files'. These files will be processed and concatenated to a separate destination. By default, these files will not be linted (the package assumes this to be third party libraries, i.e. modernizr or similar libraries). Source files for either process have to be defined in gulp-config.json. Regular Javascript files will be processed in the same way, but with JSHinting enabled. Any change in Javascript files causes an automatic browser reload.

#### css

The build assumes you will want to end up with only one CSS file and makes no distinction between critical and non critical CSS. (The performance gain is relatively low and it is somewhat difficult to determine which styles should be available directly and which should not.)
The source are .scss files, which will be linted as sass-files. The sass-files will be transpiled and concatenated to a single CSS-file. The CSS-file is then modified by several PostCSS plugins, which momentarily validate against ie8 or higher. A production specific task will minify the CSS before saving. Any change causes an automatic browser change. The browserSync plugin should only inject edited CSS, not reload the current page, handy!

The CSS task may be modified, it currently contains sort of a hybrid between Sass-compiling and PostCSS modules, especially since PostCSS has very Sass-like capabilities, without the Ruby dependency. [It might be more efficient to port Sass-compiling to PostCSS.](http://benfrain.com/breaking-up-with-sass-postcss/)

#### html
This is a fairly simple task: it copies all HTML-like files (html,htm,xml,txt) to the working directory ('dev' or 'prod', stored in "gulp-filemap.json"). The production task will also minify the HTML files. Any change causes an automatic browser reload.

#### img
The images task takes image-like files (gif,png,jpeg,jpg,svg), minifies them automatically and places them in an 'img' folder.

#### useref
This task retrieves files references from certain code blocks within the HTML, which are concatenated, minified and stored within the project.

#### rev
This task fires up the depending tasks in the right sequence (see below).

#### rev:clean
This task cleans up earlier output of the rev task. It looks for the manifest and deleted revved files. This task is run first in the complete revisioning process. It prevents earlier revved files to be added to the manifest and be revved another time.

#### rev:revision
The main task does nothing more than rename sources, based upon the manifest. This task should be added after generating external assets in order work and depends on two subtasks: rev:manifest and rev:clean.

#### rev:manifest
The revision task collects external, cacheable assets, adds a revision to the filename and stores the collection in a manifest.

### Testing tasks

#### unit
This is one to the two types of testing tasks. This task is configured to output its results in the terminal and should therefore be run in a separate terminal (this task could be run in tandem with the 'dev' or 'prod' tasks). The task starts a Karma webserver and custom browser in which the tests are validated. The Karma webserver follows a certain format for the config file. The specific config is found in the 'tests' folder: **unit.karma.conf.js**.

At the moment, a PhantomJS browser is used to validate the unit tests. A preconfigured Chrome browser is available, but disabled. The files (both test as javascript files) are being watched continuously and trigger a rerun of the tests on change. The task is configured to support Jasmine.

#### e2e
This is the end to end testing task. This task fires up a browser and performs instructed user input to validate against the written tests. This is not a task intend for continuous use and should be run before any deployment. The task starts a standalone Selenium server, opens a new browsers and starts automating the test instructions. This plugin follows a certain config file as well, which is located in the 'tests' folder: **e2e.protractor.conf.js**. It is possible to chain the production task with the end to end test, with the command: **gulp prod:test**.

### Utility tasks

#### serve
This task facilitates the browserSync plugin. The current setup assumes a local webserver is already in place. BrowserSync could also be configured to act as as standalone webserver for static files (disabled, but visible in the Gulpfile.js).

#### watch
The watch task defines which files are being watched by the taskrunner and what action should be triggers on change. The task is configured to trigger the 'js', 'css', 'html' or 'img' task, corresponding to a file change within the scope of these tasks.

#### clean:dev
Cleans up the development folder completely, does not generate a new environment.

#### clean:prod
Cleans up the production folder completely, does not generate a new environment.

#### clean:zip
Cleans up the folder storing \*.zip files. Filters on the \*.zip extension automatically.

#### zip
Takes the contents of a specified folder and zips the contents to an archive. A name can be specified. If none specified, the task defaults to the project name for a filename. In the latter case, a timestamp is added to the archive automagically to avoid naming conflicts.

---

## Resources

* [Gulp](http://gulpjs.com/)
* [Node.js](https://nodejs.org/en/)
* [PhantomJS](http://phantomjs.org/)
* [Jasmine](http://jasmine.github.io/) ([2.3](http://jasmine.github.io/2.3/introduction.html))
* [Karma](http://karma-runner.github.io/0.13/index.html)
* [Protractor](https://angular.github.io/protractor/#/)
* [Selenium](http://www.seleniumhq.org/)

---

## Todo

* Deploy directly into Cordys

---

Author: Joran Quinten
