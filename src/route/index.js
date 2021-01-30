'use strict'

const employeeRoute = require('./users.route')
const cors = require('cors')

module.exports = (app) => {
  app.use('/api/user/v1', cors(), employeeRoute)
}
