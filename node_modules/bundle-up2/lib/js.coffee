Bundle   = require './bundle'
UglifyJS = require 'uglify-js'
_        = require 'lodash'

class Js extends Bundle
  constructor: (@options) ->
    @fileExtension = '.js'
    super

  minify: (code) ->
    return code unless @options.minifyJs

    ast = UglifyJS.parser.parse code # parse code and get the initial AST
    ast = UglifyJS.uglify.ast_mangle ast # get a new AST with mangled names
    ast = UglifyJS.uglify.ast_squeeze ast # get an AST with compression optimizations
    UglifyJS.uglify.gen_code ast # compressed code here

  render: (namespace) ->
    js = ''

    SET_appended = false

    for file in @files
      if file.namespace == namespace

        if typeof file.url == "string" # added or .addJsFile
          js += "<script src='#{file.url}' type='text/javascript'></script>"

        if typeof file.url == "boolean" # added via .addJsUrl
          js += "<script src='#{file.file}' type='text/javascript'></script>"

        if typeof file.url == "object" # added via .addJsObject
          js += "<script type='text/javascript'>"

          if !SET_appended
            SET_appended = true
            js += @minify("bup={SET:#{@SET.toString()}};")+";"

          js += _.keys(file.file).map((key) -> "bup.SET('#{key}');#{key} = #{JSON.stringify(file.file[key])};").join(' ')
          js += "</script>"

    js

  # Recursively create object
  SET: (strObj) ->
    str = strObj.split('.')
    obj = window
    while(el = str.shift())
      obj[el] = {} if typeof obj[el] == "undefined"
      obj = obj[el]
    null



  _convertFilename: (filename) ->
    splitted = filename.split('.')
    splitted.splice(0, splitted.length - 1).join('.') + '.js'

module.exports = Js
