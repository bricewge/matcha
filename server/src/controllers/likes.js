const like = require('../models/likes')
const match = require('../models/matchs')
const user = require('../models/users')
const notification = require('../models/notifications')
const {AppError} = require('../helpers/error')

module.exports = {
  async create (req, res, next) {
    try {
      // console.log('CREATE', req.params)
      const userIdLiked = await user.getIdByUserName(req.params)
      let input = {fromUserId: req.user.id, toUserId: userIdLiked}
      await like.create(input)
      let inputReversed = {fromUserId: userIdLiked, toUserId: req.user.id}
      const liked = await like.alreadyLiked(inputReversed)
      // console.log(matched)
      if (liked && liked.liked) {
        await match.create({userId1: req.user.id, userId2: userIdLiked})
        input.type = 'match'
      } else {
        input.type = 'like'
      }
      await notification.create(input, req)
      res.sendStatus(201)
    } catch (err) {
      // console.log(err)
      next(err)
    }
  },

  async delete (req, res, next) {
    try {
      // console.log('DELETE', req.params)
      const userIdUnliked = await user.getIdByUserName(req.params)
      let input1 = {userId1: req.user.id, userId2: userIdUnliked}
      const input2 = {fromUserId: req.user.id, toUserId: userIdUnliked}
      const matched = await match.alreadyMatched(input1)
      if (matched.matched) {
        await match.delete(input1)
        input2.type = 'unmatch'
        await notification.create(input2, req)
      }
      await like.delete(input2)
      res.sendStatus(201)
    } catch (err) {
      next(err)
    }
  }
}
