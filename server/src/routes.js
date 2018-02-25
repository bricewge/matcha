const multer = require('multer')
const config = require('./config')
const auth = require('./controllers/auth')
const users = require('./controllers/users')

const uploading = multer(config.upload)

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to Matcha API')
  })

  app.post('/register',
    auth.register)
  app.post('/login',
    auth.login)
  app.post('/forgot',
    auth.forgotPassword)
  app.post('/reset',
    auth.resetPassword)

  app.put('/users',
    uploading,
    users.update)
}
