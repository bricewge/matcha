const mysql = require('mysql')
const Promise = require('bluebird');
const faker = require('faker')
const config = require('./config').db

const db = require('./seed')
const Users = require('./seed')

// * DB functions
var pool = null

exports.connect = function () {
  pool = Promise.promisifyAll(mysql.createPool(config))
}

exports.disconnect = function () {
  if (pool)
    pool.end()
}
exports.get = function () {
  return  pool
}

// *  Users models
exports.create = function (userName, email, firstName, lastName, password) {
  var values = [userName, email, firstName, lastName, password]
  let query = 'INSERT INTO users (username, email, first_name, last_name, password) VALUES(?)'
  return db.get().queryAsync(query, values)
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

// * Tests
exports.getDatabases = function () {
  return db.get().queryAsync('SHOW DATABASES;')
}

exports.fakeUser = function () {
  var user = []
  user.push(faker.internet.userName())
  user.push(faker.internet.email())
  user.push(faker.name.firstName())
  user.push(faker.name.lastName())
  user.push(faker.internet.password())
  return user
}

// * Seed
async function seed() {
  exports.connect()
  // await exports.getDatabases()
  //   .then((data) => {console.log(JSON.stringify(data))})
  //   .catch((err) => console.log(err.message))
  const user = exports.fakeUser()
  await Users.create(user)
    .then((data) => console.log(data))
    .catch((err) => console.log(err))
  await Users.getAllByUserName(user[0])
    .then((data) => console.log(data))
    .catch((err) => console.log(err))
  exports.disconnect()

}

seed()
