const User = require('../models/Users')

module.exports = {
  // // TODO Add interests
  // // TODO Add pictures
  async activate (req, res, next) {
    try {
      await User.activate(req.body)
    } catch (err) {next(err)}
  }
}
