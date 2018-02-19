const AuthenticationController = require('./controllers/AuthenticationController.js')

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to Matcha API')
  })

  app.post('/register',
          AuthenticationController.register)
}
