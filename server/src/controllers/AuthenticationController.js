const User = require('../models/Users')

module.exports = {
  async register (req, res, next) {
    try {
      // TODO Better response when sucessfull
      await User.create(req.body)
      res.send(JSON.stringify(req.body.userName))
    } catch (err) {
      next(err)
    }
  }
}
