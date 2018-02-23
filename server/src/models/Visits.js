const db = require('../db')

exports.create = function (fromUserId, toUserId) {
  const query = 'INSERT INTO visits (fromUserId, toUserId) VALUES(?, ?);'
  return db.get().queryAsync(query, [fromUserId, toUserId])
}

exports.delete = function (fromUserId, toUserId) {
  const query = 'DELETE FROM visits WHERE fromUserId = ? AND toUserId = ?;'
  return db.get().queryAsync(query, [fromUserId, toUserId])
}

exports.createTable = function () {
  return db.get().queryAsync(`CREATE TABLE visits (
                              id int(11) NOT NULL AUTO_INCREMENT,
                              fromUserId int(11) NOT NULL,
                              toUserId int(11) NOT NULL,
                              PRIMARY KEY (id));`)
}
