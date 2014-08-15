var test = require("tap").test
  , hock = require("hock")
  , request = require("request")
  , ai = require("../")
  , port = 1337
  , mockRes = require("./fixtures/github-response.json")

var server

test("setup", function (t) {
  var threeDaysAgo = new Date(new Date() - (1000 * 60 * 60 * 24 * 3))
  Object.keys(mockRes.items).forEach(function (i) {
    var item = mockRes.items[i]
    if (item.url === "https://api.github.com/repos/npm/npm/issues/4714")
      item.updated_at = threeDaysAgo.toISOString()
  });

  hock.createHock(port, function (err, hockServer) {
    server = hockServer

    hockServer
      .get("/some/url")
      .many()
      .reply(200, mockRes)

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
