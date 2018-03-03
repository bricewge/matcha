const multer = require('multer')
const config = require('./config')
const auth = require('./controllers/auth')
const users = require('./controllers/users')

const uploading = multer(config.upload)

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to Matcha API')
  })

  app.post('/auth/register',
    auth.register)
  app.post('/auth/login',
    auth.login)
  app.get('/auth/user',
    auth.authenticated,
    auth.user)
  app.post('/auth/forgot',
    auth.forgotPassword)
  app.post('/auth/reset',
    auth.resetPassword)

  app.put('/users',
    uploading.array('pictures', 5),
    users.update)
}
