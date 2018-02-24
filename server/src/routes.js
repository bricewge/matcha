const auth = require('./controllers/auth')
// const activate = require('./middlewares/activate')

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to Matcha API')
  })

  app.post('/register',
    auth.register)

  app.post('/login',
    auth.login)

  // app.post('/user',
  //          authentication.login)

  // app.post('/activate',
  //    activate.activate)
}
