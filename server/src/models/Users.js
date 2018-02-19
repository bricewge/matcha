const bcrypt = require('bcryptjs')
const db = require('../db')

const saltRounds = 8
// TODO: update, delete

exports.create = function (userName, email, firstName, lastName, password) {
  let query = 'INSERT INTO users (username, email, first_name, last_name, password) VALUES(?, ?, ?, ?, ?)'
  return bcrypt.hash(password, saltRounds)
    .then(function (hash) {
      var values = [userName, email, firstName, lastName, hash]
      return db.get().queryAsync(query, values)
    })
}

exports.getAllByID = function (id) {
  let query = 'SELECT * FROM users WHERE id = ?;'
  return db.get().queryAsync(query, id)
}

exports.getAllByUserName = function (userName) {
  let query = 'SELECT * FROM users WHERE username = ?;'
  return db.get().queryAsync(query, userName)
}

exports.getAll = function () {
  return db.get().queryAsync('SELECT * FROM users;')
}
