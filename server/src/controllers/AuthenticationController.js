const User = require('../models/Users')

module.exports = {
  async register (req, res, next) {
    try {
      const user = await User.create(req.body)
      res.send(user.toJSON())
    } catch (err) {
      next(err)
    }
  }
}
