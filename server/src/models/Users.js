const bcrypt = require('bcryptjs')
const db = require('../db')
const {RequestValidationError} = require('../helpers/error')

const SALT_ROUNDS = 8

// TODO: update, delete

// TODO Protect input
exports.create = async function (input) {
  const query = 'INSERT INTO users (username, email, first_name, last_name, password) VALUES(?, ?, ?, ?, ?)'
  const hash = await bcrypt.hash(input.password, SALT_ROUNDS)
  const values = [input.userName, input.email, input.firstName, input.lastName, hash]
  return db.get().queryAsync(query, values)
}

exports.getAllByID = function (input) {
  if (!input.hasOwnProperty('id')) {
    throw new RequestValidationError(['id'])
  } else {
    const query = 'SELECT * FROM users WHERE id = ?;'
    return db.get().queryAsync(query, input.id)
  }
}

exports.getAllByUserName = function (input) {
  if (!input.hasOwnProperty('userName')) {
    throw new RequestValidationError(['userName'])
  } else {
    const query = 'SELECT * FROM users WHERE username = ?;'
    return db.get().queryAsync(query, input.userName)
  }
}

exports.getAll = function () {
  return db.get().queryAsync('SELECT * FROM users;')
}
