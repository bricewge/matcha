const db = require('../db')

exports.createTable = function () {
  const table = `CREATE TABLE pictures (
                 id int(11) NOT NULL AUTO_INCREMENT,
                 userId int(11) NOT NULL,
                 path varchar(255) NOT NULL,
                 PRIMARY KEY (id));`
  return db.get().queryAsync(table)
}
