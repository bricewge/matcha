const db = require('../db')

exports.createTable = function () {
  const table = `CREATE TABLE messages (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 fromUserId int(11) NOT NULL,
                 toUserId int(11) NOT NULL,
                 message TEXT,
                 PRIMARY KEY (id));`
  return db.get().queryAsync(table)
}
