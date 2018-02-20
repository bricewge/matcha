const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

const db = require('./db')
const config = require('./config')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors()) // TODO Remove by proxying the API in the client at /api
app.use(helmet()) // Add secure HTTP headers

require('./routes')(app)
require('./middlewares/errors')(app) // Errors handling

db.connect()
if (!db.get()) {
  console.log('Unable to connect to MySQL.')
  process.exit(1)
} else {
  app.listen(config.port, function () {
    console.log(`Server started on port ${config.port}`)
  })
}
