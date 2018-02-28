module.exports = {
  port: process.env.PORT || 8081,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'matcha',
    password: process.env.DB_PASS || 'matcha',
    database: process.env.DB_NAME || 'matcha',
    root: {
      user: process.env.DB_ROOTUSER || 'root',
      password: process.env.DB_ROOTPASS || 'root'
    }
  },
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: process.env.SMTP_PORT || 25
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  },
  upload: {
    dest: 'public/uploads/',
    limit: {fileSize: 5000000, files: 5}
  }
}
