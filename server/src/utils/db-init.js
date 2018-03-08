const mysql = require('mysql')
const Promise = require('bluebird')
const db = require('../db')
const config = require('../config').db
const user = require('../models/users')
const interest = require('../models/interests')
const visit = require('../models/visits')
const like = require('../models/likes')
const match = require('../models/matchs')
const message = require('../models/messages')
const notification = require('../models/notifications')
const fake = require('../models/fakes')
const block = require('../models/blocks')

async function main () {
  if (!await dbReset()) process.exit(1)

  try {
    db.connect()
    if (!db.get()) {
      console.log('Unable to connect to MySQL.')
    }
    await dbCreateTables()
  } catch (err) {
    console.error(err)
  }
  db.disconnect()
}

async function dbReset () {
  const configRoot = {
    host: config.host,
    port: config.port,
    user: config.root.user,
    password: config.root.password,
    multipleStatements: true
  }
  const dbRoot = Promise.promisifyAll(mysql.createConnection(configRoot))
  if (!dbRoot) {
    console.log('Unable to connect to MySQL.')
    return false
  }

  try {
    await dbDrop(dbRoot, config.database)
    await dbCreate(dbRoot, config.database)
    if (!dbUserExists(dbRoot, config.user)) {
      await dbUserCreate(dbRoot, config)
    }
  } catch (err) {
    console.error(err)
    dbRoot.end()
    return false
  }
  dbRoot.end()
  return true
}

function dbDrop (db, dbName) {
  const query = 'DROP DATABASE IF EXISTS ??;'
  return db.queryAsync(query, [dbName])
}

function dbCreate (db, dbName) {
  const query = 'CREATE DATABASE IF NOT EXISTS ??;'
  return db.queryAsync(query, [dbName])
}

async function dbUserExists (db, user) {
  const query = 'SELECT User, Host FROM mysql.user WHERE User = ? AND Host = ?;'
  const row = await db.queryAsync(query, [user, config.host])
  return row.length >= 1
}

async function dbUserCreate (db, config) {
  var query = `CREATE USER ?@? IDENTIFIED BY ?;
  GRANT ALL ON ??.* TO ?@?;
  FLUSH PRIVILEGES;`
  try {
    await db.queryAsync(query, [config.user, config.host, config.password, config.database, config.user, config.host])
  } catch (err) { console.error(err.message); return }
  console.log(`DB user ${config.user} as been created`)
}

// TODO Rewrite with sql schema import
// async function dbCreateTables () {
// }

main()
