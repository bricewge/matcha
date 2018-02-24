const user = require('../models/users')

module.exports = {
  // // TODO Add interests
  // // TODO Add pictures
  async activate (req, res, next) {
    try {
      await user.activate(req.body)
    } catch (err) { next(err) }
  }
}
