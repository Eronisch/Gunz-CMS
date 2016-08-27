Bundle up!  [![Build Status](https://secure.travis-ci.org/FGRibreau/bundle-up.png)](https://secure.travis-ci.org/FGRibreau/bundle-up) [![Gittip](http://badgr.co/gittip/fgribreau.png)](https://www.gittip.com/fgribreau/)
==========

Bundle up is a middleware for connect to manage all client-side assets in an organized way.

Fork by @FGRibreau
------------------
* Fix `BundleUp(app, asset object | path string, options object);`
* Added `.addJsUrl(url [, namespace])` & `.addCssUrl(url [, namespace])`
* Fix Express 2 & 3
* Bug fix when adding the same file in different bundles
* Added `.addJsObject(object [, namespace])`
* `complete` callback when Bundle up is ready (if in production, when files are minified)

[Pound](https://github.com/FGRibreau/pound) an higher-level asset manager for Node.JS/Express now use this fork of Bundle-up.

Installation
------------

    $ npm install bundle-up2

Usage
-----

``` js
var BundleUp = require('bundle-up2')
,   assets = require('./assets');

BundleUp(app, assets, {
  staticRoot: __dirname + '/public/',
  staticUrlRoot:'/',
  bundle:true,
  minifyCss: true,
  minifyJs: true,
  complete: console.log.bind(console, "Bundle-up: static files are minified/ready")
});

// To actually serve the files a static file
// server needs to be added after Bundle Up
app.use(express.static(__dirname + '/public/'))
```

The first parameter to the BundleUp middleware is the app object and the second is the path to the assets file. Through the assets file all client-side assets needs to get added.

``` js
// assets.js
module.exports = function(assets) {
  // .addJs(filename [, namespace])
  assets.addJs('/public/js/jquery-1.6.4.min.js', 'default');
  assets.addJs('/public/js/jquery-1.6.4.min.js', 'app');

  assets.addJs('/public/js/jquery.placeholder.min.js');
  assets.addJs('/app/client/main.coffee');

  // New .addJsUrl(object [, namespace])
  assets.addJsUrl('/socket.io.js');

  // addCss(filename [, namespace])
  assets.addCss('/public/bootstrap/bootstrap.min.css');
  assets.addCss('/app/styles/screen.styl');

  // New .addCssUrl(object [, namespace])
  assets.addCssUrl('http://twitter.github.com/bootstrap/assets/css/bootstrap.css');

  // New .addJsObject(object [, namespace])
  assets.addJsObject({"Redsmin.app":{}});// Will create Redsmin.app = {};
}
```

Just point to a file (.js, .css, .coffee or .styl are currently supported) anywhere in your app directory. In your view you can then just render all the css or javascript files by calling `renderStyles` and `renderJs` like this:

``` jade
!!!
html
  head
    != renderStyles()
  body!= body
    != renderJs()
```

By default this will render

``` html
<link href='/bootstrap/bootstrap.min.css' media='screen' rel='stylesheet' type='text/css'/>
<link href='/min/app/styles/screen.css' media='screen' rel='stylesheet' type='text/css'/>

<script src='/js/jquery-1.6.4.min.js' type='text/javascript'></script>
<script src='/js/jquery.placeholder.min.js' type='text/javascript'></script>
<script src='/min/app/client/main.js' type='text/javascript'></script>
```

All assets will be compiled on-the-fly when `bundle:false` is set. Therefore the server never
needs to be restarted when editing the different assets.

To render bundles `bundle:true` needs to be passed as a parameter to the middleware. This will concatenate all javascript and css files into bundles and render this:

``` html
<link href='/min/bundle/d7aa56c_global.css' media='screen' rel='stylesheet' type='text/css'/>
<script src='/min/bundle/1e4b515_global.js' type='text/javascript'></script>
```

All bundles are min during startup. The filename will change with the content so you should configure your web server with far future expiry headers.

### min/

All files that needs to be compiled, copied (if you are bundling up a file that doesn't reside in your `public/` directory) or bundled will end up in `public/min/` directory. This is to have an organized way to separate whats actually *your code* and whats *min code*.

### Filtered paths

All files can be added in a directory by using a "filtered path" like this

``` js
// assets.js
module.exports = function(assets) {
  assets.addJs(__dirname + '/public/js/**'); //adds all files in /public/js (subdirectories included)
  assets.addJs(__dirname + '/public/*.js'); //adds all js files in /public
  assets.addJs(__dirname + '/cs/**.coffee'); //adds all coffee files in /cs (subdirectories included)
});
```
### Namespaces

Sometimes all javascript or css files cannot be bundled into the same bundle. In that case
namespaces can be used

``` js
// assets.js
module.exports = function(assets) {
  assets.addJs(__dirname + '/public/js/1.js');
  assets.addJs(__dirname + '/public/js/2.js');
  assets.addJs(__dirname + '/public/locales/en_US.js', 'en_US');

  assets.addJs(__dirname + '/public/css/1.css');
  assets.addJs(__dirname + '/public/css/2.css');
  assets.addJs(__dirname + '/public/css/ie.css', 'ie');
});
```

``` jade
!!!
html
  head
    != renderStyles()
    != renderStyles('ie')
  body!= body
    != renderJs()
    != renderJs('en_US')
```

which will render this with `bundle:false`:

``` html
<link href='/css/1.css' media='screen' rel='stylesheet' type='text/css'/>
<link href='/css/2.css' media='screen' rel='stylesheet' type='text/css'/>
<link href='/css/ie.css' media='screen' rel='stylesheet' type='text/css'/>

<script src='/js/1.js' type='text/javascript'></script>
<script src='/js/2.js' type='text/javascript'></script>
<script src='/locales/en_US.js' type='text/javascript'></script>
```

and this with `bundle:true`:

``` html
<link href='/min/bundle/d7aa56c_global.css' media='screen' rel='stylesheet' type='text/css'/>
<link href='/min/bundle/d7aa56c_ie.css' media='screen' rel='stylesheet' type='text/css'/>
<script src='/min/bundle/1e4b515_global.js' type='text/javascript'></script>
<script src='/min/bundle/1e4b515_en_US.js' type='text/javascript'></script>
```

## Donate
[Donate Bitcoins](https://coinbase.com/checkouts/fc3041b9d8116e0b98e7d243c4727a30)

License
-------

MIT licensed
