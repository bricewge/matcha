const db = require('../db')

exports.createTable = function () {
  const table = `CREATE TABLE notifications (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 userId int(11) NOT NULL,
                 type enum('like', 'visit', 'message', 'match', 'unmatch') NOT NULL,
                 PRIMARY KEY (id));`
  return db.get().queryAsync(table)
}
