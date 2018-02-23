const mysql = require('mysql')
const Promise = require('bluebird')
const db = require('../db')
const config = require('../config').db
const User = require('../models/Users')
const Picture = require('../models/Pictures')
const Interest = require('../models/Interests')
const Visit = require('../models/Visits')
const Like = require('../models/Likes')
const Match = require('../models/Matchs')
const Message = require('../models/Messages')
const Notification = require('../models/Notifications')
const Fake = require('../models/Fakes')
const Block = require('../models/Blocks')

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
    user: 'root',
    password: '',
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
  var query = `CREATE USER IF NOT EXISTS ?@? IDENTIFIED BY ?;
  GRANT ALL ON ??.* TO ?@?;
  FLUSH PRIVILEGES;`
  try {
    db.query(query, [config.user, config.host, config.password, config.database, config.user, config.host])
  } catch (err) { console.error(err.message); return }
  console.log(`DB user ${config.user} as been created`)
}

async function dbCreateTables () {
  await User.createTable()
  await Picture.createTable()
  await Interest.createTable()
  await Visit.createTable()
  await Like.createTable()
  await Match.createTable()
  await Message.createTable()
  await Notification.createTable()
  await Fake.createTable()
  await Block.createTable()
}

main()
