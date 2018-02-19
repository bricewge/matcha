const mysql = require('mysql2')
const config = require('./config').db

var state = {
  pool: null
}

exports.connect = function (done) {
  state.pool = mysql.createPool(config)
  done()
}

exports.connectA = async function () {
  return await mysql.createPool(config)
}

exports.get = function () {
  return state.pool
}

exports.exists = function () {
  const query = 'SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?'
  state.pool.query(query, config.database, function (err, res, fields) {
    // if (err) return err
    console.log(err, res, fields)
  })
}

// TODO Add fixtures and drop methods for testing
// https://www.terlici.com/2015/08/13/mysql-node-express.html
