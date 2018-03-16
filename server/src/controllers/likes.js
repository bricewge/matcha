const like = require('../models/likes')
const user = require('../models/users')
const notification = require('../models/notifications')
const {AppError} = require('../helpers/error')

module.exports = {
  // TODO Generate a match if both are liking each other
  async create (req, res, next) {
    try {
      console.log('CREATE', req.params)
      const userIdLiked = await user.getIdByUserName(req.params)
      let input = {fromUserId: req.user.id, toUserId: userIdLiked}
      await like.create(input)
      input = {
        fromUserId: input.toUserId,
        toUserId: input.fromUserId,
        type: 'like'
      }
      // input.type = 'like'
      await notification.create(input, req)
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
