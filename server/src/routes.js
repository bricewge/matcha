const auth = require('./controllers/auth')
const account = require('./controllers/account')
const users = require('./controllers/users')
const likes = require('./controllers/likes')
const block = require('./controllers/block')
const upload = require('./controllers/upload')
const notification = require('./controllers/notifications')
const fake = require('./controllers/fakes')
const match = require('./controllers/matchs')

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

  app.put('/account',
    auth.authenticated,
    upload.fields([
      {name: 'picture0', maxCount: 1},
      {name: 'picture1', maxCount: 1},
      {name: 'picture2', maxCount: 1},
      {name: 'picture3', maxCount: 1},
      {name: 'picture4', maxCount: 1}
    ]),
    account.update,
    auth.refresh)

  app.get('/users',
    auth.authenticated,
    users.index)
  app.get('/users/:userName',
    auth.authenticated,
    users.profile)

  app.post('/like/:userName',
    auth.authenticated,
    likes.create)
  app.delete('/like/:userName',
    auth.authenticated,
    likes.delete)

  app.post('/block/:userName',
    auth.authenticated,
    block.create)
  app.delete('/block/:userName',
    auth.authenticated,
    block.delete)

  app.post('/fake/:userName',
    auth.authenticated,
    fake.create)

  app.get('/notifications',
    auth.authenticated,
    notification.user)
  app.get('/matchs',
    auth.authenticated,
    match.get)
}
