const db = require('../db')
const validate = require('../helpers/validate')

exports.create = function (input) {
  const columns = ['fromUserId', 'toUserId']
  validate.input(input, columns)
  const query = 'INSERT INTO likes SET ?;'
  return db.get().queryAsync(query, input)
}

exports.delete = function (input) {
  const columns = ['fromUserId', 'toUserId']
  validate.input(input, columns)
  const query = 'DELETE FROM likes WHERE fromUserId = ? AND toUserId = ?;'
  return db.get().queryAsync(query, [input.fromUserId, input.toUserId])
}
