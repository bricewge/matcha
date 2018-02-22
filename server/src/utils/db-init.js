const mysql = require('mysql2/promise')
const db = require('../db.js')
const config = require('../config.js').db

async function main () {
  const dbRoot = await mysql.createConnection({
    host: config.host,
    user: 'root',
    password: '',
    multipleStatements: true
  })

  await dbDrop(dbRoot, config.database)
  await dbCreate(dbRoot, config.database)
  if (!await dbUserExists(dbRoot, config.user)) {
    await dbUserCreate(dbRoot, config)
  }
  dbRoot.end()

  db.connect(async function (err) {
    if (err) {
      console.log('Unable to connect to MySQL.')
    }
  })
  dbCreateTables(db.get())
  // db.get().end()
}
// TODO Remove await in fuction

// async function dbExists(db, dbName) {
//   var query = 'SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?;'
//   try { var [row, fields] = await db.execute(query, [dbName])}
//   catch(err) { console.error(err.message); return false}
//   return row.length ? true : false
// }

async function dbDrop (db, dbName) {
  var query = 'DROP DATABASE IF EXISTS ??;'
  try {
    db.query(query, [dbName])
  } catch (err) { console.error(err) }
}

async function dbCreate (db, dbName) {
  var query = 'CREATE DATABASE IF NOT EXISTS ??;'
  try {
    db.query(query, [dbName])
  } catch (err) { console.error(err.message) }
}

async function dbUserExists (db, user) {
  var query = 'SELECT User, Host FROM mysql.user WHERE User = ? AND Host = ?;'
  try {
    var [row] = await db.execute(query, [user, config.host])
  } catch (err) { console.error(err.message); return false }
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

async function dbCreateTables (db) {
  try {
    // TODO Add to users: location, online/status
    await db.query(`CREATE TABLE users (
                   id int(11) NOT NULL AUTO_INCREMENT,
                   username varchar(255) NOT NULL,
                   email varchar(255) NOT NULL,
                   first_name varchar(255) NOT NULL,
                   last_name varchar(255) NOT NULL,
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
  } catch (err) { console.error(err.message) }
}

main()
