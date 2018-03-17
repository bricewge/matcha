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

exports.getAllById = function (input) {
  validate.input(input, ['id'])
  const query = `
    SELECT u.userName, u.picture0, u.fame
    FROM users u
    LEFT JOIN matchs m
      ON (u.id = m.userId1 OR u.id = m.userId2)
    WHERE (userId1 = '?'
          OR userId2 = '?')
          AND u.id != '?'
    ;
  `
  input = [input.id, input.id, input.id]
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
