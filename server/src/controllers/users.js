const user = require('../models/users')
const {pick} = require('../helpers/object')
const {AppError} = require('../helpers/error')

module.exports = {
  // TODO Finalize it
  async index (req, res, next) {
    try {
      const users = await user.getAllForId(req.user)
      console.log(users[248])
      let results = []
      for (let i = 0; i < users.length; i++) {
        if (users[i].activation === 'active' &&
            users[i].blocked !== req.user.id) {
          let userData = pick(users[i], user.publicData)
          delete userData.activation
          // TODO Find if user is liked or blocked
          userData.liked = users[i].fromUserId === req.user.id
          userData.interests = JSON.parse(users[i].interests) || []
          results.push(userData)
        }
      }
      console.log(results[42])
      res.json(results)
    } catch (err) {
      next(err)
    }
  },

  // TODO Finalize it
  // Show blocked user
  async show (req, res, next) {
    try {
      let result = await user.getAllByUserName(req.params)
      if (!result) throw new AppError('Invalid userName', 400)
      result = pick(result, user.publicData)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }
}
