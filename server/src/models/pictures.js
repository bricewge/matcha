const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const validate = require('../helpers/validate')
const db = require('../db')

exports.create = async function (input) {
  const columns = ['userId', 'path']
  validate.input(input, columns)
  await fs.accesAsync(input.path, fs.constants.R_OK)
  const query = 'INSERT INTO pictures SET ?;'
  let result = await db.get().queryAsync(query, input)
  return exports.getAllById({id: result.insertId})
}

// ?Does the return is consistent with the rest of the model?
exports.delete = async function (input) {
  validate.input(input, ['id'])
  const query = 'DELETE FROM pictures WHERE id = ?;'
  return db.get().queryAsync(query, input.id)
}

exports.getAllById = async function (input) {
  validate.input(input, ['id'])
  const query = 'SELECT * FROM pictures WHERE id = ?;'
  const result = await db.get().queryAsync(query, input.id)
  return result[0]
}

exports.getAllByUserId = async function (input) {
  validate.input(input, ['userId'])
  const query = 'SELECT * FROM pictures WHERE userId = ?;'
  const result = await db.get().queryAsync(query, input.userId)
  return result
}

exports.createTable = function () {
  const table = `CREATE TABLE pictures (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 userId int(11) NOT NULL,
                 path varchar(255) NOT NULL,
                 PRIMARY KEY (id));`
  return db.get().queryAsync(table)
}
