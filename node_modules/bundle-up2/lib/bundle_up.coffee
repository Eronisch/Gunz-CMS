AssetsManager    = require './assets_manager'
_                = require 'lodash'
Js               = require './js'
Css              = require './css'
OnTheFlyCompiler = require './otf_compiler'
compilers        = require './default_compilers'

class BundleUp
  constructor: (app, asset, options = {bundle:false}) ->
    unless options.compilers?
      options.compilers = compilers
    else
      options.compilers.stylus = options.compilers.stylus || compilers.stylus
      options.compilers.coffee = options.compilers.coffee || compilers.coffee
      options.compilers.js = options.compilers.js || compilers.js
      options.compilers.css = options.compilers.css || compilers.css

    options.minifyCss = options.minifyCss || false
    options.minifyJs = options.minifyJs || false
    options.complete = options.complete || ->

    @app = app
    @js = new Js(options)
    @css = new Css(options)

    if typeof asset == "string"
      require(asset)(new AssetsManager(@css, @js))
    else if typeof asset == 'function'
      asset(new AssetsManager(@css, @js))
    else
      throw new Error("Unsupported asset type")

    if options.bundle
      done = _.after(2, options.complete)
      @js.toBundles(done)
      @css.toBundles(done)
    else
      # Compile files on-the-fly when not bundled
      @app.use (new OnTheFlyCompiler(@js, @css, options.compilers)).middleware
      options.complete()


    if(@app.locals)
      # Support for Express 3
      @app.locals.renderStyles= (namespace=@css.defaultNamespace) => return @css.render(namespace)
      @app.locals.renderJs = (namespace=@js.defaultNamespace) => return @js.render(namespace)


    else if(@app.dynamicHelpers)
      # Support for Express 2
      @app.dynamicHelpers(
          renderStyles: @css.render.bind(@css)
          renderJs: @js.render.bind(@js)
      )


module.exports = (app, assetPath, options)->
  new BundleUp(app, assetPath, options)
