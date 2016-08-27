class AssetsManager
  constructor: (@css, @js)->
    @root = ''

  addCss: (file, namespace=undefined) =>
    @css.addFile("#{@root}/#{file}", namespace)

  addCssUrl: (file, namespace=undefined) =>
    @css.addUrl(file, namespace)

  addJs: (file, namespace=undefined) =>
    @js.addFile("#{@root}/#{file}", namespace)

  addJsUrl: (file, namespace=undefined) =>
    @js.addUrl(file, namespace)

  addJsObject: (obj, namespace=undefined) =>
    @js.addObject(obj, namespace)

module.exports = AssetsManager
