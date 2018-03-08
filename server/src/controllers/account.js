const fs = require('fs')
const user = require('../models/users')
const interest = require('../models/interests')
const validate = require('../helpers/validate')
const {pick} = require('../helpers/object')


async function activateUser (input) {
  const data = await user.getAllById(input)
  const interests = await interest.getAllByUserId({userId: input.id})
  const require = ['sex', 'sexualPreference', 'age',
                   'biography', 'picture0', 'location']
  const hasAllKeys = require.every(i => !!data[i])
  let activation = hasAllKeys && interests.length ? 'active' : 'register'
  await user.update({id: input.id, activation: activation})
}

module.exports = {
  async update (req, res, next) {
    try {
      let filter = user.publicData.concat(user.privateData)
      let userData = pick(req.body, filter)
      userData.id = req.user.id
      console.log(req.body)
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
        const url = `${req.headers.origin}/${req.files[file][0].path}`
        userData[file] = url
      }
      // Remove File
      for (let i = 0; i < 5; i++) {
        let key = 'picture' + i
        if (userData[key] === 'remove') userData[key] = null
      }
      await user.update(userData)
      // TODO Activate account if engnouth data in DB
      await activateUser(req.user)
      // console.log(userData.interests)
      res.sendStatus(201)
    } catch (err) {
      for (let key in req.files) {
        fs.unlinkSync(req.files[key][0].path)
      }
      next(err)
    }
  }
}
