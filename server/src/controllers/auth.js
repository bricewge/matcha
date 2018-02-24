const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {pick} = require('../helpers/object')
const user = require('../models/users')
const config = require('../config')
const validate = require('../helpers/validate')
const {AppError} = require('../helpers/error')

// A controller should:
// - Sanatize data
// - Return errors; they can came from the models or the controller
// - Return data
// Possible errors:
// - missing fields
// - not wanted fields
// - wrong type
// - already exits

// Maybe should be merged in loggedUserData
function jwtSignUser (user) {
  return jwt.sign(user,
    config.authentication.jwtSecret,
    {expiresIn: '30d'})
}

function loggedUserData (user) {
  user = pick(user, ['id', 'userName', 'activation'])
  return {user, token: jwtSignUser(user)}
}

module.exports = {
  async register (req, res, next) {
    const filter = ['userName', 'email', 'password', 'firstName', 'lastName']
    const input = pick(req.body, filter)
    try {
      validate.email(req.body.email)
      validate.password(req.body)
      let result = await user.create(input)
      res.json(loggedUserData(result))
    } catch (err) {
      next(err)
    }
  },

  async login (req, res, next) {
    try {
      const err = new AppError('Incorrect login credentials', 400)
      let result = await user.getAllByUserName(req.body)
      if (!result) {
        throw err
      } else if (!await bcrypt.compare(req.body.password, result.password)) {
        throw err
      } else {
        res.json(loggedUserData(result))
      }
    } catch (err) {
      next(err)
    }
  },

  async forgotPasword (req, res, next) {
    try {
      const result = await user.getAllByEmail(req.body)
      const err = new Error('reset.failed')
      if (!result) throw err
      else if (result.length) throw err
      else {
        // add token to db
        // send email
        // notify user
      }
    } catch (err) {
      if (err.message === 'reset.failed') {
        res
          .status(400)
          .json({error: 400, message: 'Wrong email'})
      } else {
        next(err)
      }
    }
  }
  // TODO resetPassword: GET with token
}
