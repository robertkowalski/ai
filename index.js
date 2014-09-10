var request = require("request")

var GITHUB_USERNAME = process.env.AI_GITHUB_USERNAME
  , OLDISSUE

if (process.env.AI_DAYS)
  OLDISSUE = new Date() - (+process.env.AI_DAYS * 1000 * 60 * 60 * 24)
else
  OLDISSUE = new Date() - (1000 * 60 * 60 * 24 * 15)

function getIssues (url, user, repo, cb) {
  var aiUrl = url || "https://api.github.com/search/issues" +
    "?q=commenter:" + GITHUB_USERNAME + "+state:open+user:" +
    user + "+repo:" + repo

  request({
    json: true,
    url: aiUrl,
    headers: {
      "User-Agent": "Abandoned issue script"
    }
  }, function (er, res, body) {
    if (!body || !body.items) return console.error("\nNo issues found.")
    filter(body.items, user, cb)
  })
}

function filter (issues, user, cb) {
  var i = issues.filter(function (el) {
    var match = new RegExp(user + "/" + "issues").test(el.html_url)
    var old = new Date(el.updated_at).getTime() < OLDISSUE
    return match && old
  })
  return cb(i)
}

module.exports = getIssues
