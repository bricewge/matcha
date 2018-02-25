const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Promise = require('bluebird')
const crypto = Promise.promisifyAll(require('crypto'))
const {pick} = require('../helpers/object')
const user = require('../models/users')
const config = require('../config')
const validate = require('../helpers/validate')
const {AppError} = require('../helpers/error')
let transporter = nodemailer.createTransport({sendmail: true})

// A controller should:
// - Sanatize data
// - Return errors; they can came from the models or the controller
// - Return data
// Possible errors:
// - missing fields
// - not wanted fields
// - wrong type
// - already exists

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
      validate.email(input.email)
      validate.password(input)
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

  async forgotPassword (req, res, next) {
    try {
      const result = await user.getAllByEmail(req.body)
      const err = new AppError('Invalid email', 400)
      if (!result) throw err
      let token = await crypto.randomBytesAsync(20)
      token = token.toString('hex')
      user.update({id: result.id, resetPasswordToken: token})
      transporter.sendMail({
        to: result.email,
        subject: 'Matcha password reset',
        text: `To reset your password follow this link: ${req.headers.origin}/reset/${token}\n`
      })
      res.json({message: `An email has been send to ${result.email}`})
    } catch (err) {
      next(err)
    }
  },

  async resetPassword (req, res, next) {
    try {
      const err = new AppError('Invalid token')
      const input = pick(req.body, ['resetPasswordToken', 'password'])
      let result = await user.getAllByResetPasswordToken(input)
      if (!result ||
          input.resetPasswordToken !== result.resetPasswordToken) throw err
      result.password = input.password
      result.resetPasswordToken = null
      validate.password(result)
      result = await user.update(result)
      res.json(loggedUserData(result))
    } catch (err) {
      next(err)
    }
  }
}
