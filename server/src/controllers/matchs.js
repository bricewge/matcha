const match = require('../models/matchs')

module.exports = {
  async get (req, res, next) {
    try {
      // console.log(req.user)
      let matchs = await match.getAllById({id: req.user.id})
      res.json(matchs)
    } catch (err) {
      // console.log(err)
      next(err)
    }
  }
}
