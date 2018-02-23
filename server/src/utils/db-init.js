const mysql = require('mysql')
const Promise = require('bluebird')
const db = require('../db')
const config = require('../config').db

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
  // TODO Add to users: location, online/status
  await db.get().queryAsync(`CREATE TABLE users (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 userName varchar(255) NOT NULL,
                 email varchar(255) NOT NULL,
                 firstName varchar(255) NOT NULL,
                 lastName varchar(255) NOT NULL,
                 password varchar(255) NOT NULL,
                 activation enum('email', 'profile', 'active') NOT NULL DEFAULT 'email',
                 sex enum('male', 'female'),
                 sexual_orientation enum('hetero', 'homo', 'bi'),
                 fame SMALLINT UNSIGNED NOT NULL DEFAULT 0,
                 birthday DATE,
                 biography TEXT,
                 PRIMARY KEY (id),
                 UNIQUE KEY username (username),
                 UNIQUE KEY email (email));`)
  // TODO Table pictures, with id profile picture
  // TODO Table likes
  // TODO Tables interests
  // TODO Tables visites
  // TODO ?Table chat?
}

main()
