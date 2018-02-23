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
  // Users
  // TODO ?Force location?
  await db.get().queryAsync(`CREATE TABLE users (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 userName varchar(255) NOT NULL,
                 email varchar(255) NOT NULL,
                 firstName varchar(255) NOT NULL,
                 lastName varchar(255) NOT NULL,
                 password varchar(255) NOT NULL,
                 activation enum('email', 'profile', 'active', 'fake') NOT NULL DEFAULT 'email',
                 sex enum('male', 'female'),
                 sexual_orientation enum('hetero', 'homo', 'bi'),
                 fame SMALLINT UNSIGNED NOT NULL DEFAULT 0,
                 birthday DATE,
                 biography TEXT,
                 picture1 varchar(255),
                 picture2 varchar(255),
                 picture3 varchar(255),
                 picture4 varchar(255),
                 picture5 varchar(255),
                 location POINT,
                 online enum('N','Y') NOT NULL DEFAULT 'N',
                 socketid varchar(20),
                 PRIMARY KEY (id),
                 UNIQUE KEY userName (userName),
                 UNIQUE KEY email (email));`)
  // Tags of interests
  await db.get().queryAsync(`CREATE TABLE tags (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 userId int(11) NOT NULL,
                 tag varchar(255) NOT NULL,
                 PRIMARY KEY (id));`)
  // Visits
  await db.get().queryAsync(`CREATE TABLE visits (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 fromUserId int(11) NOT NULL,
                 toUserId int(11) NOT NULL,
                 PRIMARY KEY (id));`)
  // Likes
  await db.get().queryAsync(`CREATE TABLE likes (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 fromUserId int(11) NOT NULL,
                 toUserId int(11) NOT NULL,
                 PRIMARY KEY (id));`)
  // Matches
  await db.get().queryAsync(`CREATE TABLE matchs (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 fromUserId int(11) NOT NULL,
                 toUserId int(11) NOT NULL,
                 PRIMARY KEY (id));`)
  // Messages
  await db.get().queryAsync(`CREATE TABLE messages (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 fromUserId int(11) NOT NULL,
                 toUserId int(11) NOT NULL,
                 message TEXT,
                 PRIMARY KEY (id));`)
  // Notifications
  await db.get().queryAsync(`CREATE TABLE notifications (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 userId int(11) NOT NULL,
                 type enum('like', 'visit', 'message', 'match', 'unmatch') NOT NULL,
                 PRIMARY KEY (id));`)
  // Reported as fake
  await db.get().queryAsync(`CREATE TABLE fakes (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 fromUserId int(11) NOT NULL,
                 toUserId int(11) NOT NULL,
                 PRIMARY KEY (id),
                 UNIQUE (fromUserId, toUserId));`)
  // Blocked users
  await db.get().queryAsync(`CREATE TABLE blocks (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 fromUserId int(11) NOT NULL,
                 toUserId int(11) NOT NULL,
                 PRIMARY KEY (id),
                 UNIQUE (fromUserId, toUserId));`)
}

main()
