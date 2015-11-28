# generator-modern-frontend [![Build Status](https://secure.travis-ci.org/endel/generator-modern-frontend.png?branch=master)](https://travis-ci.org/endel/generator-modern-frontend)

> [Yeoman](http://yeoman.io) generator that scaffolds out a modern front-end web app using [gulp](http://gulpjs.com/). Inspired by [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp).

![](screenshot.png)

## Features

* Browserify + ES6 (babelify)
* Pick your favorite CSS pre-processor (Sass, Stylus or Less)
* CSS Autoprefixing
* Sourcemaps for CSS and JavaScript
* Built-in preview server with BrowserSync
* Image optimization
* Wire-up dependencies installed with [Bower](http://bower.io)

#### Sprite sheet

For sprite generation, you'll need to create a directory for each sprite
category on `app/images/sprites/`. It will generate its respective stylesheet
and sprite sheet files as the following:

- `app/images/sprites/general/*.png` generates:
  - `css/sprites/general.styl`
  - `images/sprites_general.png`
- `app/images/sprites/heavy_stuff/*.png` generates:
  - `css/sprites/heavy_stuff.styl`
  - `images/sprites_heavy_stuff.png`

Please see our [gulpfile.js](app/templates/gulpfile.js) for up to date information on what we support.

*For more information on what this generator can do for you, take a look at the [gulp plugins](app/templates/_package.json) used in our `package.json`.*

## Getting Started

- Install dependencies: `npm install --global yo bower`
- Install the generator: `npm install --global generator-modern-frontend`
- Run `yo modern-frontend` to scaffold your webapp
- Run `npm start` to preview and watch for changes
- Run `bower install --save <package>` to install frontend dependencies
- Run `gulp` to build for production

## Bower components

This generator includes the following Bower components by default:

- Modernizr
- normalize.css

Read the [details](docs/bower.md) about our Bower setup.

## Options

- `--skip-install`
  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
