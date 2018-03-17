const db = require('../db')
const validate = require('../helpers/validate')

exports.create = function (input) {
  const columns = ['userId1', 'userId2']
  validate.input(input, columns)
  const query = 'INSERT INTO matchs SET ?;'
  return db.get().queryAsync(query, input)
}

exports.delete = function (input) {
  const columns = ['userId1', 'userId2']
  validate.input(input, columns)
  const query = `
    DELETE FROM matchs
    WHERE (userId1 = ? AND userId2 = ?)
          OR (userId2 = ? AND userId1 = ?)
    ;
  `
  input = [input.userId1, input.userId2,
           input.userId1, input.userId2]
  return db.get().queryAsync(query, input)
}

exports.alreadyMatched = async function (input) {
  const columns = ['userId1', 'userId2']
  validate.input(input, columns)
  const query = `
    SELECT COUNT(*) AS matched
    FROM matchs
    WHERE (userId1 = ? AND userId2 = ?)
          OR (userId2 = ? AND userId1 = ?)
    ;
  `
  input = [input.userId1, input.userId2,
           input.userId1, input.userId2]
  const result = await db.get().queryAsync(query, input)
  return result[0]
}
