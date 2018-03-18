const socketio = require('socket.io')
const jwt = require('jsonwebtoken')
const config = require('./config').authentication
const notification = require('./models/notifications')
const user = require('./models/users')
const message = require('./models/messages')

exports.emitToConnected = function (toUserName, event, data, io) {
  for (let index in io.sockets.connected) {
    let conn = io.sockets.connected[index]
    // console.log(conn.auth, conn.userName, toUserName)
    if (conn.auth && conn.userName === toUserName) {
      // console.log(conn.userName)
      io.sockets.to(index).emit(event, data)
    }
  }
}
exports.listen = function (app) {
  const io = socketio.listen(app)

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
        // console.log('Disconnecting socket ', socket.id)
        socket.disconnect('unauthorized')
      }
    }, 10000)

    socket.on('disconnect', function () {
      // console.log(`${socket.userName} disconnected`)
    })

    socket.on('sawNotification', async function (data) {
      try {
        await notification.seen({userName: socket.userName, notifsId: data})
      } catch (err) {  }
    })
    socket.on('removeNotification', async function (data) {
      try {
        // console.log('remove Notification:', data)
        await notification.delete({userName: socket.userName, id: data})
      } catch (err) { }
    })

    socket.on('newMessage', async function (data) {
      try {
        exports.emitToConnected(data.toUserName, 'newMessage', data, io)
        const toUserId = await user.getIdByUserName({userName: data.toUserName})
        const fromUserId = await user.getIdByUserName({userName: data.fromUserName})
        // console.log(data, toUserId, fromUserId)
        await message.create({
          fromUserId: fromUserId,
          toUserId: toUserId,
          message: data.message
        })
      } catch (err) { }
    })
  })

  return io
}
