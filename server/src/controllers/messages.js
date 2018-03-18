const user = require('../models/users')
const message = require('../models/messages')
const match = require('../models/matchs')

module.exports = {
  async get (req, res, next) {
    try {
      const userId = await user.getIdByUserName({userName: req.params.userName})
      let input = {userId1: req.user.id, userId2: userId}
      const matched = await match.alreadyMatched(input)
      if (matched) {
        input = {fromUserId: req.user.id, toUserId: userId}
        let messages = await message.getAllByUserId(input)
        for (let index in messages) {
          if (messages[index].toUserId === req.user.id) {
            messages[index].toUserName = req.user.userName
          } else {
            messages[index].toUserName = req.params.userName
          }
          delete messages[index].toUserId
          delete messages[index].fromUserId
        }
        // console.log(messages)
        res.json(messages)
      } else {
        res.sendStatus(403)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
