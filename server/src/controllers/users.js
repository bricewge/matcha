const user = require('../models/users')
const {pick} = require('../helpers/object')
const validate = require('../helpers/validate')
const {AppError} = require('../helpers/error')

module.exports = {
  // TODO Finalize it
  async index (req, res, next) {
    try {
      const users = await user.getAll()
      // console.log(users[42])
      let results = []
      for (let i = 0; i < users.length; i++) {
        if (users[i].activation === 'active') {
          let userData = pick(users[i], user.publicData)
          delete userData.activation
          // TODO Find if user is liked or blocked
          userData.liked = false
          results.push(userData)
        }
      }
      res.json(results)
    } catch (err) {
      next(err)
    }
  },

  // TODO Finalize it
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
