const block = require('../models/blocks')
const user = require('../models/users')

module.exports = {
  async create (req, res, next) {
    try {
      // console.log('CREATE block', req.params)
      const userIdBlocked = await user.getIdByUserName(req.params)
      const input = {fromUserId: req.user.id, toUserId: userIdBlocked}
      await block.create(input)
      res.sendStatus(201)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  async delete (req, res, next) {
    try {
      // console.log('DELETE block', req.params)
      const userIdUnblocked = await user.getIdByUserName(req.params)
      const input = {fromUserId: req.user.id, toUserId: userIdUnblocked}
      await block.delete(input)
      res.sendStatus(201)
    } catch (err) {
      next(err)
    }
  }
}
