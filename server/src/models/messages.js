const db = require('../db')
const validate = require('../helpers/validate')

exports.create = function (input) {
  const columns = ['fromUserId', 'toUserId', 'message']
  validate.input(input, columns)
  const query = 'INSERT INTO messages SET ?;'
  return db.get().queryAsync(query, input)
}

exports.getAllByUserId = async function (input) {
  validate.input(input, ['fromUserId', 'toUserId'])
  const query = `
    SELECT *
    FROM messages
    WHERE (fromUserId = ? AND toUserId = ?)
          OR (toUserId = ? AND fromUserId = ?)
    ;
  `
  input = [input.fromUserId, input.toUserId,
           input.fromUserId, input.toUserId]
  const result = await db.get().queryAsync(query, input)
  return result
}
