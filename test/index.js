var test = require("tap").test
  , hock = require("hock")
  , request = require("request")
  , ai = require("../")
  , port = 1337

var server

test("setup", function (t) {
  hock.createHock(port, function (err, hockServer) {
    server = hockServer

    hockServer
      .get("/some/url")
      .many()
      .reply(200, require("./fixtures/github-response.json"))

    t.end()
  })
})

test("filters other projects which contain the same name", function (t) {
  ai("http://localhost:" + port + "/some/url", "npm", "npm", function (i) {
    i.forEach(function (el) {
      t.notEqual(
        el.url
      , "https://api.github.com/repos/npm/npm-registry-client/issues/27")
    })
    t.end()
  })
})

test("filters other projects that are just 3 days old", function (t) {
  ai("http://localhost:" + port + "/some/url", "npm", "npm",  function (i) {
    i.forEach(function (el) {
      t.notEqual(
        el.url
      , "https://api.github.com/repos/npm/npm/issues/4714")
    })
    t.end()
  })
})

test("cleanup", function (t) {
  server.close()
  t.end()
})
