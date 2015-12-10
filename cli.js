#!/usr/bin/env node
var about = require('./package.json')
var version = require('version-route')(__dirname)
var PouchDB = require('pouchdb')

var config = require('rc')(about.name, {
  seaportautopilot: {
    onlyBind: true,
    port: 21323
  }
})

if (!config._[0]) return help()
var db = new PouchDB(config._[0])
require('./index').start(db, config)

function help() {
	console.log('usage: whoru-server http://localhost:5984/whoaru')
}
