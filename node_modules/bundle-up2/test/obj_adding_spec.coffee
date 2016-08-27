expect = require 'expect.js'
Js = require './../lib/js'
Css = require './../lib/css'
helper = require './helper'
fs = require 'fs'

describe 'When adding JS Object', ->
  beforeEach ->
    helper.beforeEach()
    @js = new Js(staticRoot:"#{__dirname}/files/public", staticUrlRoot:'/')
    @css = new Css(staticRoot:"#{__dirname}/files/public", staticUrlRoot:'/')

  it 'should add the correct paths when adding an URL', ->
    @js.addObject({'MyApp.env':{}})

    file = @js.files[0]
    expect(file.url).to.eql({})
    expect(file.file).to.eql({'MyApp.env':{}})
