const db = require('../db')

exports.create = function (id, interest) {
  const query = 'INSERT INTO interests (userId, interest) VALUES(?, ?);'
  return db.get().queryAsync(query, [id, interest])
}

exports.delete = function (id, interest) {
  const query = 'DELETE FROM interests WHERE userId = ? AND interest = ?;'
  return db.get().queryAsync(query, [id, interest])
}

exports.createTable = function () {
  const table = `CREATE TABLE interests (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 userId int(11) NOT NULL,
                 interest varchar(255) NOT NULL,
                 PRIMARY KEY (id),
                 UNIQUE (userId, interest));`
  return db.get().queryAsync(table)
}
