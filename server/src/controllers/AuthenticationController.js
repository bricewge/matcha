const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {pick} = require('../helpers/object')
const User = require('../models/Users')
const config = require('../config')

function jwtSignUser (user) {
  return jwt.sign(user,
    config.authentication.jwtSecret,
    {expiresIn: '7d'})
}

module.exports = {
  async register (req, res, next) {
    try {
      // TODO Better response when sucessfull
      // console.log(req.body)
      await User.create(req.body)
      res.send(JSON.stringify(req.body.userName))
    } catch (err) {
      next(err)
    }
  },

  async login (req, res, next) {
    try {
      const err = new Error('login.failed')
      let dbRes = await User.getAllByUserName(req.body)
      if (!dbRes) {
        throw err
      } else if (!dbRes.length) {
        throw err
      } else if (!await bcrypt.compare(req.body.password, dbRes[0].password)) {
        throw err
      } else {
        const user = pick(dbRes[0], 'username', 'activation')
        res.json({
          user,
          token: jwtSignUser(user)
        })
      }
    } catch (err) {
      if (err.message === 'login.failed') {
        res
          .status(400)
          .json({error: 400, message: 'Incorrect login credentials'})
      } else {
        next(err)
      }
    }
  }
}
