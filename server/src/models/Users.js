const db = require('../db.js')

exports.create = function (userName, email, firstName, lastName, password, done) {
  var values = [userName, email, firstName, lastName, password]
  const query = 'INSERT INTO users (username, email, first_name, last_name, password) VALUES(?, ?, ?, ?, ?)'

  db.get().query(query, values, function (err, result) {
    if (err) return done(err)
    done(null, result.insertId)
  })
}

exports.getAll = function (done) {
  db.get().query('SELECT * FROM users', function (err, rows) {
    if (err) return done(err)
    done(null, rows)
  })
}

exports.getAllByUser = function (userId, done) {
  db.get().query('SELECT * FROM users WHERE user_id = ?', userId, function (err, rows) {
    if (err) return done(err)
    done(null, rows)
  })
}
