const db = require('../db')
const validate = require('../helpers/validate')

exports.create = async function (input) {
  const columns = ['userId', 'path']
  validate.input(input, columns)
  const query = 'INSERT INTO interests SET ?;'
  let result = await db.get().queryAsync(query, input)
  return exports.getAllById({id: result.insertId})
}

exports.delete = async function (input) {
  validate.input(input, ['id'])
  const query = 'DELETE FROM interests WHERE id = ?;'
  return db.get().queryAsync(query, input.id)
}

exports.getAllById = async function (input) {
  validate.input(input, ['id'])
  const query = 'SELECT * FROM interests WHERE id = ?;'
  const result = await db.get().queryAsync(query, input.id)
  return result[0]
}

exports.getAllByUserId = async function (input) {
  validate.input(input, ['userId'])
  const query = 'SELECT * FROM interests WHERE userId = ?;'
  const result = await db.get().queryAsync(query, input.userId)
  return result
}

exports.getUniqueInterest = async function () {
  const query = 'SELECT DISTINCT interest FROM interests;'
  const result = await db.get().queryAsync(query)
  return result
}

exports.createTable = function () {
  const table = `CREATE TABLE interests (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 userId int(11) NOT NULL,
                 interest varchar(255) NOT NULL,
                 PRIMARY KEY (id),
                 UNIQUE (userId, interest));`
  return db.get().queryAsync(table)
}
