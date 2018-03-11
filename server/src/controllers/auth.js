const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Promise = require('bluebird')
const crypto = Promise.promisifyAll(require('crypto'))
const {pick} = require('../helpers/object')
const user = require('../models/users')
const interest = require('../models/interests')
const config = require('../config')
const validate = require('../helpers/validate')
const {AppError} = require('../helpers/error')
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  ignoreTLS: true
})

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
  const payload = pick(user, ['userName', 'activation'])
  return jwt.sign(payload,
    config.authentication.jwtSecret,
    {expiresIn: '30d'})
}

module.exports = {
  async register (req, res, next) {
    const filter = ['userName', 'email', 'password', 'firstName', 'lastName']
    const input = pick(req.body, filter)
    try {
      validate.email(input.email)
      validate.password(input)
      let result = await user.create(input)
      const token = jwtSignUser(result)
      res.setHeader('Authorization', token)
      res.sendStatus(201)
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
      }
      const token = jwtSignUser(result)
      res.setHeader('Authorization', token)
      res.sendStatus(201)
    } catch (err) {
      next(err)
    }
  },

  async authenticated (req, res, next) {
    try {
      const authHeader = req.get('Authorization')
      if (!authHeader || authHeader.indexOf('Bearer ') !== 0) {
        throw new AppError('Bearer token is missing', 400)
      }
      const token = authHeader.substr(7)
      const decoded = jwt.verify(token, config.authentication.jwtSecret)
      req.user = await user.getAllByUserName(decoded)
      next()
    } catch (err) {
      next(err)
    }
  },

  async user (req, res, next) {
    try {
      let result = await user.getAllByUserName(req.user)
      let filter = user.publicData
      filter.push('email')
      result = pick(result, filter)
      result.interests = await interest.getAllByUserId({userId: req.user.id})
      res.json({data: result})
    } catch (err) {
      console.log(err)
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
        html: `<p>To reset your password follow this
               <a href="${req.headers.origin}/reset/${token}">link</a>.
               </p>`
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
      res.sendStatus(201)
    } catch (err) {
      next(err)
    }
  }
}
