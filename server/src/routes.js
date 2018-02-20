const AuthenticationController = require('./controllers/AuthenticationController.js')
const AuthenticationControllerPolicy = require('./middlewares/AuthenticationControllerPolicy')

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to Matcha API')
  })

  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
}
