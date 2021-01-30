'use strict'

const express = require('express')
const app = express()
const config = require('config')
const dbUtil = require('./lib/db')(config.database)
dbUtil.connect()
global.db = dbUtil

app.use('/public', express.static('./public/'))
require('./middleware')(app)

require('./route')(app)

module.exports = app
