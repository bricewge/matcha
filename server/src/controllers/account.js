const fs = require('fs')
const user = require('../models/users')
const interest = require('../models/interests')
const validate = require('../helpers/validate')
const {pick} = require('../helpers/object')
// const {AppError} = require('../helpers/error')

module.exports = {
  async update (req, res, next) {
    try {
      let filter = user.publicData.concat(user.privateData)
      let userData = pick(req.body, filter)
      if (userData.hasOwnProperty('email')) validate.email(userData.email)
      if (userData.hasOwnProperty('password')) validate.password(userData)
      if (userData.age < 18) delete userData.age
      // TODO Update user
      // TODO Update interests
      const interests = JSON.parse(req.body.interests)
      if (interests) {
        await interest.updateAll({
          userId: req.user.id,
          interests: interests})
      }
      // TODO Update images
      console.log(interests)
      res.json({msg: 'TODO'})
    } catch (err) {
      for (let key in req.files) {
        fs.unlinkSync(req.files[key][0].path)
      }
      next(err)
    }
  }
}
