const notification = require('../models/notifications')

module.exports = {
  async user (req, res, next) {
    try {
      let notifs = await notification.getAllByUserId({id: req.user.id})
      res.json(notifs)
    } catch (err) { next(err) }
  },

  async seen (req, res, next) {
    try {
      console.log(req.body)
      // let notifs = await notification.seen({id: req.user.id})
      // res.json(notifs)
    } catch (err) { next(err) }
  }
}
