crypto                      = require 'crypto'
path                        = require 'path'
compiler                    = require './compiler'
fs                          = require 'fs'
async                       = require 'async'
{writeToFile, normalizeUrl, fileExistSync} = require './helpers'

class Bundle
  constructor: (@options) ->
    @options.staticRoot = path.normalize(@options.staticRoot)
    @files = []
    @defaultCompiledDir = 'min'
    @defaultNamespace = 'global'

  # Gets relative path from staticRoot. If the
  # file passed in resides in another folder
  # the path returned is relative to the
  # root of the application
  _getRelativePath: (file) =>
    relativePath = ''
    for char, i in file
      if @options.staticRoot[i] == file[i]
        continue
      else
        relativePath = file.substring(i)
        break
    return relativePath

  #
  # Determines based on file extension
  # if the file needs to get compiled
  #
  _needsCompiling: (file) ->
    fileExt = file.split('.')
    fileExt = fileExt[fileExt.length - 1]
    return  fileExt != 'js' and fileExt != 'css'

  addFilesBasedOnFilter: (filterPath, namespace) ->
    directoryPath = filterPath.substring(0, filterPath.indexOf('*'))

    searchFiles = filterPath.substring(filterPath.indexOf('*.') + 1)
    searchFiles = undefined if searchFiles == filterPath
    searchNested = filterPath.indexOf('**') > -1


    foundFiles = []
    directoryFind = (dir, retrying=false) ->
      try
        files = fs.readdirSync(dir)

        for file in files
          file = dir + '/' + file
          unless fs.lstatSync(file).isDirectory()
            if searchFiles
              if file.indexOf(searchFiles) > -1
                foundFiles.push file
            else
              foundFiles.push file

          else if searchNested
            directoryFind(file)
      catch err
        if err.code == 'ENOENT'
          unless retrying
            # We need to retry to see if it matches a directory
            # based on a earlier directory in the path. As an
            # example "/path/to/dir* should match /path/to/directory/
            closestDir = dir.split('/')
            dir = closestDir.splice(0, closestDir.length-1).join('/')
            searchFiles = dir + '/' + closestDir.splice(closestDir.length-1).join('')
            searchNested = true
            directoryFind(dir, true)
          else
            # Found no files when retrying either...
            return
        else
          console.log err
    directoryFind(directoryPath)

    foundFiles = foundFiles.sort()
    for file in foundFiles
      @addFile(file, namespace)


  addFile:(file, namespace=@defaultNamespace) =>
    file = path.normalize(file)

    for f in @files
      # File already exists!
      return if file is f.origFile and namespace is f.namespace

    # Check if the file is a "filter path"
    if file.indexOf('*') > -1
      return @addFilesBasedOnFilter(file, namespace)

    relativeFile = @_getRelativePath(file)
    origFile = file
    needsCompiling = false

    # Determine if we need to copy/compile
    # the file into the staticRoot folder
    if (file.indexOf(@options.staticRoot) == -1 or @_needsCompiling(file))
      writeTo = path.normalize(@_convertFilename("#{@options.staticRoot}/#{@defaultCompiledDir}/#{relativeFile}"))
      needsCompiling = true
      file = writeTo
      relativeFile = @_getRelativePath(file)

    url = @options.staticUrlRoot + relativeFile

    url = normalizeUrl(url)
    @files.push
      url: url
      file: file
      origFile: origFile
      needsCompiling: needsCompiling
      namespace: namespace

  addUrl:(url, namespace=@defaultNamespace) =>
    @_addUrl(url, namespace, true)

  addObject: (object, namespace=@defaultNamespace) =>
    throw new Error(".addObject(object, ...) must be an object") if typeof object is not "object"

    @files.push
      url: {}
      file: object
      origFile: null
      needsCompiling: false
      namespace: namespace

  _addUrl:(url, namespace=@defaultNamespace, isFromPublicAPI=false) =>
    @files.push
      url: if isFromPublicAPI then true else url
      file: url
      origFile: url
      needsCompiling: false
      namespace: namespace


  toBundles: (fnToBundleDone) =>
    fnToBundleDone = fnToBundleDone || ->

    compileBundle = (files, namespace, fnCompileDone) =>
      str = ''
      specialFiles = []

      files = files.filter((file) -> file.namespace == namespace)

      fileIterator = (file, cb) =>
        if typeof file.url == "object" or typeof file.url == "boolean"
          specialFiles.push(file.file)
          return cb(null, undefined)

        else if typeof file.url is "string"
          @_compile(file.origFile, file.file, (err, content) ->
            cb(err, content.trim('\n'))
          )

      complete = (err, results) =>
        throw new Error("compileBundle " + err) if(err)

        results = results.filter((o) -> typeof(o) != "undefined")
        str     = results.join(if @fileExtension is '.css' then '\n' else ';\n')

        hash     = crypto.createHash('md5').update(str).digest('hex')
        filepath = "#{@options.staticRoot}/#{@defaultCompiledDir}/bundle/#{hash.substring(0, 7)}_#{namespace}#{@fileExtension}"

        # Then add the special files (urls & objects)

        for specialFile in specialFiles
          if typeof specialFile is "object"
            # Add the object
            @addObject(specialFile, namespace)
          else
            # Add the objecturl
            @_addUrl(specialFile, namespace)

        # If the bundle contains something
        if results.length > 0
          if(fileExistSync(filepath))
            # this bundle was already compiled, skip it
          else
            str  = @minify(str)

            writeToFile(filepath, str)

          # Add the bundle file
          @addFile(filepath, namespace)

        fnCompileDone()

      async.map(files, fileIterator, complete)


    # Find all bundles name
    bundles = []
    for file in @files
      bundles.push file.namespace unless file.namespace in bundles

    # Remove all files
    files = @files
    @files = []

    # bundleIterator = (bundle, cb) ->
    #   compileBundle(bundle, files, cb)

    # Only add the bundle files
    async.forEach(bundles, compileBundle.bind(@, files), fnToBundleDone)

  _compile: (file, writeTo, cb) =>

    compiler.compileFile(@options.compilers, file, (err, content) ->
      throw err if err?
      writeToFile(writeTo, content)
      cb(null, content)
    )

module.exports = Bundle
