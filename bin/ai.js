#!/usr/bin/env node

var args = process.argv.slice(2)

if (!args || args[0].split("/").length !== 2)
  return printHelp()

var userRepo = args[0].split("/")
  , getIssues = require("../")

getIssues(null, userRepo[0], userRepo[1], function (issues) {
  issues.map(function (el) {
    console.log(el.html_url)
  })
})

function printHelp () {
  console.log("\n\
Usage:\n\n\
  $ ai $USERNAME/$REPO\
")
}
