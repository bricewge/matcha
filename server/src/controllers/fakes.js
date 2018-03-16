const fake = require('../models/fakes')
const user = require('../models/users')

module.exports = {
  async create (req, res, next) {
    try {
      console.log('CREATE fake', req.params)
      const userIdReported = await user.getIdByUserName(req.params)
      const input = {fromUserId: req.user.id, toUserId: userIdReported}
      await fake.create(input)
      res.sendStatus(201)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
