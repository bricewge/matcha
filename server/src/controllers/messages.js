const user = require('../models/users')
const message = require('../models/messages')

module.exports = {
  async get (req, res, next) {
    try {
      // if match
      // send messages
      // else redirect
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
