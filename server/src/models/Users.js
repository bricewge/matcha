const bcrypt = require('bcryptjs')
const db = require('../db')
const {RequestValidationError} = require('../helpers/error')

const SALT_ROUNDS = 8

// TODO: update, delete

exports.create = async function (input) {
  const query = 'INSERT INTO users (userName, email, firstName, lastName, password) VALUES(?, ?, ?, ?, ?);'
  const hash = await bcrypt.hash(input.password, SALT_ROUNDS)
  const values = [input.userName, input.email, input.firstName, input.lastName, hash]
  return db.get().queryAsync(query, values)
}

// TODO Catch wrong enum
// TODO Add interests
// TODO Add pictures
exports.activate = async function (input) {
  const query = `UPDATE users
                 SET sex = ?, sexualPreference = ?, biography = ?,
                 biography = ?, birthday = ?, location = ?, picture1 = ?,
                 WHERE userName = ?;`
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
    const query = 'SELECT * FROM users WHERE userName = ?;'
    return db.get().queryAsync(query, input.userName)
  }
}

exports.getAll = function () {
  return db.get().queryAsync('SELECT * FROM users;')
}

exports.createTable = function () {
  const table = `CREATE TABLE users (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 userName varchar(255) NOT NULL,
                 email varchar(255) NOT NULL,
                 firstName varchar(255) NOT NULL,
                 lastName varchar(255) NOT NULL,
                 password varchar(255) NOT NULL,
                 activation enum('register', 'active', 'fake') NOT NULL DEFAULT 'register',
                 sex enum('male', 'female'),
                 sexualPreference enum('hetero', 'homo', 'bi'),
                 fame SMALLINT UNSIGNED NOT NULL DEFAULT 0,
                 birthday DATE,
                 biography TEXT,
                 profilePicture varchar(255),
                 location POINT,
                 online enum('N','Y') NOT NULL DEFAULT 'N',
                 socketid varchar(20),
                 resetPasswordToken varchar(255),
                 PRIMARY KEY (id),
                 UNIQUE KEY userName (userName),
                 UNIQUE KEY email (email),
                 UNIQUE KEY profilePicture (profilePicture));`
  return db.get().queryAsync(table)
}
