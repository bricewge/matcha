const db = require('../db')

exports.create = function (fromUserId, toUserId) {
  const query = 'INSERT INTO matches (fromUserId, toUserId) VALUES(?, ?);'
  return db.get().queryAsync(query, [fromUserId, toUserId])
}

exports.delete = function (fromUserId, toUserId) {
  const query = 'DELETE FROM matches WHERE fromUserId = ? AND toUserId = ?;'
  return db.get().queryAsync(query, [fromUserId, toUserId])
}

exports.createTable = function () {
  const table = `CREATE TABLE matchs (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 fromUserId int(11) NOT NULL,
                 toUserId int(11) NOT NULL,
                 PRIMARY KEY (id),
                 UNIQUE (fromUserId, toUserId));`
  return db.get().queryAsync(table)
}
