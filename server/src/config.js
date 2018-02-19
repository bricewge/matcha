module.exports = {
  port: process.env.PORT || 8081,
  db: {
    host: process.env.DB_NAME || 'localhost',
    user: process.env.DB_USER || 'matcha',
    password: process.env.DB_PASS || 'matcha',
    database: process.env.DB_NAME || 'matcha'
  }
}
