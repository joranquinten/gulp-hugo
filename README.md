Gulp-hugo
=======

A barebones, standardized boilerplate for combining Hugo and Gulp into a single web project.

---

## Introduction
This repo creates an empty environment where [Hugo](https://gohugo.io/) and [Gulp](https://gulpjs.com) can play nicely together. I tried to combine the best of both worlds: the processing power of Gulp and plugins and the speedy server of Hugo. The process assumes you want to process (lint, concatenate, minify) your assets before using them in the Hugo server. Hugo generates the HTML and serves to the browser. Before deployment, I have attached a Gulp task which in turn reads out the generated HTML and removes any unnecessary CSS.

The repository does not contain a preset theme. You should be able to install a theme or use Hugo as instructed in the [documentation](https://gohugo.io/overview/introduction/).

_Disclaimer: I use a Windows x64 environment for web development. This repo has been tried and tested on Windows7x64 and Windows10x64._

### Contents

- [Dependencies](#markdown-header-dependencies)
- [Installation](#markdown-header-installation)
    - [Structure](#markdown-header-gulpfolder)
- [Usage](#markdown-header-usage)
    - [Developing](#markdown-header-developing)
    - [Deploying for production](#markdown-header-deploying-for-production)
- [Tasks](#markdown-header-tasks)
    - [Main tasks](#markdown-header-main-tasks)
    - [Task components](#markdown-header-task-components)
    - [Testing tasks](#markdown-header-testing-tasks)
    - [Utility tasks](#markdown-header-utility-tasks)
- [Resources](#markdown-header-resources)

---
### Dependencies

The package needs some additional software to run. Gulp and its plugins are supported by Node.js. The rest of the software in this list is needed to perform certain tasks, but no primary tasks and could be neglected, based upon usage.

* [Node.js](https://nodejs.org/en/)
* [Hugo](https://gohugo.io/) The static site generator of choice! ([Installation on windows](https://gohugo.io/tutorials/installing-on-windows/))
* [Gulp](https://gulpjs.com) (Install globally via npm: "**npm install gulp -g**")
* [Git](https://git-scm.com/download/win) (optional, for cloning the boilerplate)
* [Ruby](https://www.ruby-lang.org/en/documentation/installation/) is optional. The package is required solely for linting \*.scss files. gulp-scss-lint depends on Ruby to run. The alternative, gulp-sass-lint does not work with tabs in files. Sass linting is disabled by default.

### Installation

After installing the software, installation should be as simple as cloning (or even downloading) a repository to your local machine and running: **npm install** from the terminal. The preferred location would be the designated \sites\ folder from Hugo.

### Usage

The package is built around two main processes: developing and deploying for production:

### Developing

During development, you should have the 'dev' task running (command: **gulp dev**). This will monitor changes you make to files. Javascript and Sass files will be linted on the fly, and will be compiled. Any new assets added to the structure, require a restart of the 'dev' task. The watch-task does, as of yet, not support monitoring the creation of new files.

The task also starts the Hugo server, which loads the static website to memory and serves on a local host. Browser syncing in enabled by default. This follows the default Hugo process.

### Deploying for production
This task (command: **gulp prod**) starts with cleaning up any previous builds: it deletes the \public\ folder.
The rest of the process follows the development process and is used to compile the source to a production environment. The main difference is that all assets will be minified. There is no watch task.

The task then starts the Hugo build task, which writes the static website to the \public\ folder. After generating, another Gulp task reads the HTML output and removes unnecessary CSS rules from the generated files.

---

## Tasks (order of appearance)

The configuration file should make it easier to modify the input, output and options of the tasks. Each task which touches files, addresses them via a function (pathFiles), which joins the base-folder with the separate filenames.

_Note: tasks by default do not track the creation or deletion of files!_

### Main tasks

These are the tasks which should be called upon, although specific tasks may be called upon individually.

#### default
This is the task which automatically gets called with the "gulp" command. Fires up the development task (**dev**) by default.

#### dev
This is the default task, and it assumes that it will involve manipulating the front end assets (js, css, html, images), watches the assets and kicks of Hugo server.

#### dev:nowatch
This task only performs the build actions of the dev task, with no automated watching of files. Hugo server will start, also without listener.

#### prod
This task is exactly similar to the default dev-task. The difference is that the global variable _isDevelop_ is set to _false_ before executing the tasks, which enables some extra options, specifically suited for a production environment (think uglifying the assets). Instead of server from Hugo a Hugo build gets triggered which generates the static result to the \public\ folder.

#### clean
Cleans the \public\ folder.

---

## Todo

* Expand configurable options and move to separate file

---

Author: Joran Quinten
