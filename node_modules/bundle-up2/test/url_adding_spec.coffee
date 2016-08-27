expect = require 'expect.js'
Js = require './../lib/js'
Css = require './../lib/css'
helper = require './helper'
fs = require 'fs'

describe 'When adding urls', ->
  beforeEach ->
    helper.beforeEach()
    @js = new Js(staticRoot:"#{__dirname}/files/public", staticUrlRoot:'/')
    @css = new Css(staticRoot:"#{__dirname}/files/public", staticUrlRoot:'/')

  it 'should add the correct paths when adding an URL', ->
    @js.addUrl('/socket.io.js')

    file = @js.files[0]
    expect(file.file).to.equal("/socket.io.js")
    expect(file.url).to.equal(true)
