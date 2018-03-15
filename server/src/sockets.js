const socketio = require('socket.io')
const jwt = require('jsonwebtoken')
const config = require('./config').authentication

// TODO Auth user by JWT
module.exports.listen = function (app) {
  const io = socketio.listen(app)

  // let users = io.of('/users')
  // users.on('connection', function (socket) {
  // })

  // io.use(socketioJwt.authorize({
  //   secret: config.jwtSecret,
  //   handshake: true
  // }))

  let testNb = 42
  // Socket test
  io.on('connection', function (socket) {
    socket.emit('authenticate')
    socket.on('authenticate', function (data) {
      socket.auth = false
      if (!data || !data.token) return
      const decoded = jwt.verify(data.token, config.jwtSecret)
      if (decoded) {
        socket.auth = true
        socket.userName = decoded.userName
      }
    })
    setTimeout(function () {
      if (!socket.auth) {
        console.log('Disconnecting socket ', socket.id)
        socket.disconnect('unauthorized')
      }
    }, 10000)

    socket.on('disconnect', function () {
      console.log(`${socket.userName} disconnected`)
    })

    socket.on('sawNotification', function (data) {
      console.log('saw Notification:', data)
    })
    socket.on('removeNotification', function (data) {
      console.log('remove Notification:', data)
    })
  })

  return io
}
