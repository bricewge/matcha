const fs = require('fs')
const url = require('url')
const {URL} = require('url')
const path = require('path')
const user = require('../models/users')
const interest = require('../models/interests')
const validate = require('../helpers/validate')
const {pick} = require('../helpers/object')

async function activateUser (input) {
  const data = await user.getAllById(input)
  const interests = await interest.getAllByUserId({userId: input.id})
  const required = ['sex', 'sexualPreference', 'age',
                   'biography', 'picture0', 'location']
  const hasAllKeys = required.every(i => !!data[i])
  let activation = hasAllKeys && interests.length ? 'active' : 'register'
  await user.update({id: input.id, activation: activation})
}

module.exports = {
  async update (req, res, next) {
    try {
      let filter = user.publicData.concat(user.privateData)
      let userData = pick(req.body, filter)
      userData.id = req.user.id
      if (userData.hasOwnProperty('email')) validate.email(userData.email)
      if (userData.hasOwnProperty('password')) validate.password(userData)
      if (userData.age < 18) delete userData.age
      let interests = []
      if (req.body.interests) {
        interests = JSON.parse(req.body.interests)
      }
      await interest.updateAll({
        userId: req.user.id,
        interests: interests})
      userData.location = JSON.parse(userData.location)
      // Add file
      for (let file in req.files) {
        // console.log(userData.picture0)
        let referer = new URL(req.headers.referer)
        const imageUrl = `${referer.origin}/${req.files[file][0].path}`
        // console.log(referer.origin)
        userData[file] = imageUrl
      }
      // Remove File
      for (let i = 0; i < 5; i++) {
        let key = 'picture' + i
        if (userData[key] === 'remove') {
          userData[key] = null
        }
      }
      await user.update(userData)
      await activateUser(req.user)
      req.user.userName = userData.userName
      next()
    } catch (err) {
      for (let key in req.files) {
        fs.unlinkSync(req.files[key][0].path)
      }
      next(err)
    }
  }
}
