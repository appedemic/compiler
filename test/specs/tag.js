var fs = require('fs'),
  path = require('path')

describe('Compile tags', function() {
  // in Windows __dirname is the real path, path.relative uses symlink
  var
    basepath = path.resolve(__dirname, '../..'),
    fixtures = path.relative(basepath, path.join(__dirname, 'fixtures')),
    expected = path.relative(basepath, path.join(__dirname, 'expect'))

  // adding some custom riot parsers
  // css
  compiler.parsers.css.myparser = function(tag, css) {
    return css.replace(/@tag/, tag)
  }
  // js
  compiler.parsers.js.myparser = function(js) {
    return js.replace(/@version/, '1.0.0')
  }

  function render(str, name) {
    return compiler.compile(str, {}, path.join(fixtures, name))
  }

  function cat(dir, filename) {
    return fs.readFileSync(path.join(dir, filename)).toString()
  }

  function testFile(name) {
    var src = cat(fixtures, name + '.tag'),
      js = render(src, name + '.tag')

    expect(js).to.equal(cat(expected, name + '.js'))
  }

  it('Timetable tag', function() {
    testFile('timetable')
  })

  it('Mixing JavaScript and custom tags', function() {
    testFile('mixed-js')
  })

  it('Tag definition and usage on same file', function() {
    testFile('same')
  })

  it('Scoped CSS', function() {
    testFile('scoped')
  })

  it('Quotes before ending HTML bracket', function() {
    testFile('input-last')
  })

  it('Preserves the object inside the tags', function() {
    testFile('box')
  })

  it('Flexible method style (v2.3)', function() {
    testFile('free-style')
  })

  it('Detect some fake closing html tags', function () {
    testFile('html-blocks')
  })

  it('The treeview question', function () {
    testFile('treeview')
  })

  it('Included files (v2.3.1)', function() {
    testFile('includes')
  })

  it('Dealing with unclosed es6 methods', function () {
    testFile('unclosed-es6')
  })

  it('Compatibility with one line tags', function () {
    testFile('oneline')
  })

  it('With attributes in the root', function () {
    var
      src = cat(fixtures, 'root-attribs.tag'),
      js = compiler.compile(src)        // no name, no options
    expect(js).to.equal(cat(expected, 'root-attribs.js'))
  })

  it('script/style attributes with values type object', function () {
    var
      src = cat(fixtures, 'script-attribs.tag'),
      js = compiler.compile(src, { parser: testOpts })

      function testOpts(src, opts) {
        expect(opts).to.eql({ val: true })
      }
  })

  it('Empty tag', function () {
    testFile('empty')
  })

  it('The url name is optional', function () {
    var js = compiler.compile('<url/>', {})
    expect(js).to.equal("riot.tag2('url', '', '', '', function(opts) {\n});")
  })

  it('In shorthands newlines are converted to spaces #1306', function () {
    testFile('so-input')
  })

})
