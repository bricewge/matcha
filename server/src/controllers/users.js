const user = require('../models/users')
const {pick} = require('../helpers/object')
const {AppError} = require('../helpers/error')
const {commonItems} = require('../helpers/array')

module.exports = {
  // TODO Finalize it
  async index (req, res, next) {
    try {
      const users = await user.getAllForId(req.user)
      let results = []
      for (let i = 0; i < users.length; i++) {
        if (users[i].activation === 'active' &&
            users[i].blocked !== req.user.id) {
          let userData = pick(users[i], user.publicData)
          delete userData.activation
          userData.liked = users[i].liked === req.user.id
          userData.interests = JSON.parse(users[i].interests) || []
          userData.interestsInCommon = commonItems(req.user.interests, userData.interests)
          results.push(userData)
        }
      }
      res.json(results)
    } catch (err) {
      next(err)
    }
  },

  async profile (req, res, next) {
    try {
      let result = await user.getUserByUserName({userName: req.params.userName, id: req.user.id})
      if (!result) throw new AppError('Invalid userName', 400)
      let response = pick(result, user.publicData)
      response.liked = !!result.liked
      response.blocked = !!result.blocked
      response.fake = !!result.fake
      response.interests = JSON.parse(result.interests) || []
      response.lastConnexion = result.lastConnexion
      res.json(response)
    } catch (err) {
      next(err)
    }
  }
}
