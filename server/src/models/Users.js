const bcrypt = require('bcryptjs')
const db = require('../db')

const saltRounds = 8
// TODO: update, delete

exports.create = function (input) {
  let query = 'INSERT INTO users (username, email, first_name, last_name, password) VALUES(?, ?, ?, ?, ?)'
  return bcrypt.hash(input.password, saltRounds)
    .then(function (hash) {
      var values = [input.userName, input.email, input.firstName, input.lastName, hash]
      return db.get().queryAsync(query, values)
    })
}

exports.getAllByID = function (input) {
  let query = 'SELECT * FROM users WHERE id = ?;'
  return db.get().queryAsync(query, input.id)
}

exports.getAllByUserName = function (input) {
  let query = 'SELECT * FROM users WHERE username = ?;'
  return db.get().queryAsync(query, input.userName)
}

exports.getAll = function () {
  return db.get().queryAsync('SELECT * FROM users;')
}
