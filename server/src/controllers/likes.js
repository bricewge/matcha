const like = require('../models/likes')
const user = require('../models/users')
const {AppError} = require('../helpers/error')

module.exports = {
  // TODO Generate a match if both are liking each other
  async create (req, res, next) {
    try {
      console.log('CREATE', req.params)
      const userIdLiked = await user.getIdByUserName(req.params)
      const input = {fromUserId: req.user.id, toUserId: userIdLiked}
      await like.create(input)
      res.sendStatus(201)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  async delete (req, res, next) {
    try {
      console.log('DELETE', req.params)
      const userIdUnliked = await user.getIdByUserName(req.params)
      const input = {fromUserId: req.user.id, toUserId: userIdUnliked}
      await like.delete(input)
      res.sendStatus(201)
    } catch (err) {
      next(err)
    }
  }
}
