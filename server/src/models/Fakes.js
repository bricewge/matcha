const db = require('../db')

exports.create = function (fromUserId, toUserId) {
  const query = 'INSERT INTO fakes (fromUserId, toUserId) VALUES(?, ?);'
  return db.get().queryAsync(query, [fromUserId, toUserId])
}

exports.delete = function (fromUserId, toUserId) {
  const query = 'DELETE FROM fakes WHERE fromUserId = ? AND toUserId = ?;'
  return db.get().queryAsync(query, [fromUserId, toUserId])
}

exports.createTable = function () {
  const table = `CREATE TABLE fakes (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 fromUserId int(11) NOT NULL,
                 toUserId int(11) NOT NULL,
                 PRIMARY KEY (id),
                 UNIQUE (fromUserId, toUserId));`
  return db.get().queryAsync(table)
}
