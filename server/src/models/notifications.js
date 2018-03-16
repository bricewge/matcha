const user = require('../models/users')
const validate = require('../helpers/validate')
const db = require('../db')

function emitToConnected (toUserName, event, data, io) {
  for (let index in io.sockets.connected) {
    let conn = io.sockets.connected[index]
    console.log(conn.auth, conn.userName, toUserName)
    if (conn.auth && conn.userName === toUserName) {
      console.log(conn.userName)
      io.sockets.to(index).emit(event, data)
    }
  }
}

// Return all of what is needed to test before sending a notification
// and the data for sending it
async function helperTestBlocked (input) {
  const columns = ['fromUserId', 'toUserId']
  validate.input(input, columns)
  const query = `
    SELECT userName AS toUserName,
           (
            SELECT userName
            FROM users
            WHERE id = ?
            ) AS fromUserName,
            (
            SELECT picture0
            FROM users
            WHERE id = ?
            ) AS fromUserPicture,
            (
            SELECT COUNT(*)
            FROM blocks
            WHERE fromUserId = ? AND toUserId = ?
            ) AS blocked
    FROM users
    WHERE id = ?
    ;
  `
  input = [input.fromUserId, input.fromUserId, input.toUserId,
           input.fromUserId, input.toUserId]
  const result = await db.get().queryAsync(query, input)
  return result[0]
}

// NOTE This is ugly! Models should'nt depend on other models (here: users)
exports.create = async function (input, req) {
  const columns = ['toUserId', 'fromUserId', 'type']
  validate.input(input, columns)
  const test = await helperTestBlocked(input)
  // console.log(input, test)
  if (test && !test.blocked) {
    const query = 'INSERT INTO notifications SET ?;'
    let result = await db.get().queryAsync(query, input)
    let notif = {
      id: result.insertId,
      userName: test.fromUsername,
      image: test.fromUserPicture,
      type: input.type,
      seen: false}
    emitToConnected(test.toUserName, 'newNotification', notif, req.io)
  }
  // if (result && result.insertId) {
  //   let notif = {id: result.insertId, type: input.type, seen: false}
  //   result = await user.getAllById({id: input.fromUserId})
  //   notif.image = result.picture0
  //   notif.userName = result.userName
  //   result = await user.getAllById({id: input.toUserId})
  //   emitToConnected(result.userName, 'newNotification', notif, req.io)
  // }
}

exports.delete = async function (input) {
  validate.input(input, ['userName', 'id'])
  const query = `
    DELETE FROM notifications
    WHERE
      toUserId = (SELECT id FROM users WHERE userName = ?)
      AND id = ?;
  `
  await db.get().queryAsync(query, [input.userName, input.id])
}

exports.seen = async function (input) {
  validate.input(input, ['userName', 'notifsId'])
  if (!input.notifsId.length) return
  const query = `
    UPDATE notifications SET seen = true
    WHERE
      toUserId = (SELECT id FROM users WHERE userName = ?)
      AND id IN ?;
  `
  await db.get().queryAsync(query, [input.userName, [input.notifsId]])
}

exports.getAllByUserId = async function (input) {
  validate.input(input, ['id'])
  const query = `
    SELECT n.id, n.type, n.seen, u.userName, u.picture0 AS image
    FROM notifications n
    LEFT JOIN users u
      ON n.fromUserId = u.id
    WHERE toUserId = ?;
  `
  const result = await db.get().queryAsync(query, input.id)
  return result
}
