const mysql = require('mysql')
const Promise = require('bluebird')
const config = require('./config').db

var pool = null

exports.connect = function () {
  pool = Promise.promisifyAll(mysql.createPool(config))
}

exports.disconnect = function () {
  if (pool) pool.end()
}
exports.get = function () {
  return pool
}

// TODO Drop multiples tables
exports.drop = function (table) {
  let query = 'DELETE FROM ??'
  return pool.queryAsync(query, table)
}

exports.getDatabases = function () {
  return pool.queryAsync('SHOW DATABASES;')
}

// TODO Add fixtures method for testing
// https://www.terlici.com/2015/08/13/mysql-node-express.html
