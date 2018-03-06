const bcrypt = require('bcryptjs')
const mysql = require('mysql')
const db = require('../db')
const validate = require('../helpers/validate')

const SALT_ROUNDS = 8

// Actions: C(reate)R(emove)U(pdate)D(elete)
// Verify type of data and required data

// ?Do I need to verify all the types? Or only that it doesn't crash

// const enums = {
//   activation: ['register', 'active', 'fake'],
//   sex: ['male', 'female'],
//   sexualPreference: ['hetero', 'homo', 'bi']
// }
exports.create = async function (input) {
  const columns = ['userName', 'email', 'firstName', 'lastName', 'password']
  validate.input(input, columns)
  // validate.enum(input, enums)
  const query = 'INSERT INTO users SET ?;'
  input.password = await bcrypt.hash(input.password, SALT_ROUNDS)
  let result = await db.get().queryAsync(query, input)
  return exports.getAllById({id: result.insertId})
}

exports.update = async function (input) {
  validate.input(input, ['id'])
  // validate.enum(input, enums)
  let query = 'UPDATE users SET ? WHERE id = ?;'
  const id = input.id
  delete input.id
  if (input.hasOwnProperty('password')) {
    input.password = await bcrypt.hash(input.password, SALT_ROUNDS)
  }
  query = mysql.format(query, [input, id])
  await db.get().queryAsync(query, input)
  return exports.getAllById({'id': id})
}

exports.getAllById = async function (input) {
  validate.input(input, ['id'])
  const query = 'SELECT * FROM users WHERE id = ?;'
  const result = await db.get().queryAsync(query, input.id)
  return result[0]
}

exports.getAllByUserName = async function (input) {
  validate.input(input, ['userName'])
  const query = 'SELECT * FROM users WHERE userName = ?;'
  const result = await db.get().queryAsync(query, input.userName)
  return result[0]
}

exports.getAllByEmail = async function (input) {
  validate.input(input, ['email'])
  const query = 'SELECT * FROM users WHERE email = ?;'
  const result = await db.get().queryAsync(query, input.email)
  return result[0]
}

exports.getAllByResetPasswordToken = async function (input) {
  validate.input(input, ['resetPasswordToken'])
  const query = 'SELECT * FROM users WHERE resetPasswordToken = ?;'
  const result = await db.get().queryAsync(query, input.resetPasswordToken)
  return result[0]
}

// Not sure if it's consistent with the result
// of the other functions of the model
exports.getAll = async function () {
  return db.get().queryAsync('SELECT * FROM users;')
}

exports.publicData = ['userName', 'firstName', 'lastName',
                      'sex', 'sexualPreference', 'birthday',
                      'biography', 'profilePicture', 'fame',
                      'age', 'location']

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
                 online tinyint(1) NOT NULL DEFAULT 0,
                 socketid varchar(20),
                 resetPasswordToken varchar(255),
                 PRIMARY KEY (id),
                 UNIQUE KEY userName (userName),
                 UNIQUE KEY email (email),
                 UNIQUE KEY profilePicture (profilePicture));`
  return db.get().queryAsync(table)
}
