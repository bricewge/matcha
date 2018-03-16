const app = require('express')()
const server = require('http').Server(app)
// const io = require('socket.io')(server)
const express = require('express')
// const http = require('http').Server(app)
const bodyParser = require('body-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const path = require('path')

const db = require('./db')
const io = require('./sockets').listen(server)
const config = require('./config')

async function main () {
  // const app = express()
  app.use(morgan('combined'))
  app.use(bodyParser.json())
  app.use(helmet()) // Add secure HTTP headers

  app.use(function (req, res, next) {
    req.io = io
    next()
  })

  const uploadPath = path.join(__dirname, '..', config.upload.dest)
  app.use('/' + config.upload.dest, express.static(uploadPath))

  require('./routes')(app)
  require('./middlewares/errors')(app) // Errors handling

  try {
    db.connect()
    let test = await db.get().getConnectionAsync()
    test.release()
  } catch (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  }

  // Gracefully exit nodemon wants to kill the process
  process.once('SIGUSR2', function () {
    db.disconnect()
    process.kill(process.pid, 'SIGUSR2')
  })

  server.listen(config.port, function () {
    console.log(`Server listening on port ${config.port}`)
  })
}

main()
