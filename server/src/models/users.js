const bcrypt = require('bcryptjs')
const mysql = require('mysql')
const db = require('../db')
const validate = require('../helpers/validate')
const {AppError} = require('../helpers/error')

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
  let query = 'INSERT INTO users SET ?;'
  if (input.hasOwnProperty('password')) {
    input.password = await bcrypt.hash(input.password, SALT_ROUNDS)
  }
  if (input.hasOwnProperty('location')) {
    validate.location(input.location)
    input.location = mysql.raw(`POINT(${input.location.latitude}, ${input.location.longitude})`)
  }
  query = mysql.format(query, [input])
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
  if (input.hasOwnProperty('location')) {
    validate.location(input.location)
    input.location = mysql.raw(`POINT(${input.location.latitude}, ${input.location.longitude})`)
  }
  query = mysql.format(query, [input, id])
  await db.get().queryAsync(query, input)
  return exports.getAllById({'id': id})
}

// TODO Return interests and filter by sex
exports.getAllForId = async function (input) {
  validate.input(input, ['id'])
  const query = `SELECT *
                 FROM users
                 LEFT JOIN likes
                   ON users.id = toUserId;`
  const result = await db.get().queryAsync(query, input.userName)
  if (!result[0]) throw new AppError('Invalid userName', 400)
  return result
}

exports.getIdByUserName = async function (input) {
  validate.input(input, ['userName'])
  const query = 'SELECT id FROM users WHERE userName = ?;'
  const result = await db.get().queryAsync(query, input.userName)
  if (!result[0]) throw new AppError('Invalid userName', 400)
  return result[0].id
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
  if (result[0] && result[0].location) {
    result[0].location.latitude = result[0].location.x
    result[0].location.longitude = result[0].location.y
    delete result[0].location.x
    delete result[0].location.y
  }
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
                      'sex', 'sexualPreference', 'age',
                      'biography', 'fame', 'activation',
                      'age', 'location', 'locationName',
                      'picture0', 'picture1', 'picture2',
                      'picture3', 'picture4']

exports.privateData = ['email', 'password']
