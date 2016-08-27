rimraf = require 'rimraf'
exports.beforeEach = ->
  try
    rimraf.sync(__dirname + '/files/public/min')
  catch e
    #ignoring...
