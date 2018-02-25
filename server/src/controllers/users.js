const user = require('../models/users')
const {pick} = require('../helpers/object')
const validate = require('../helpers/validate')

module.exports = {
  // TODO Add interests

  // What append if their is no id??

  // validate
  // test if image exists aleady
  // if doesn't exists copy it on disk if space left
  // add to db
  async update (req, res, next) {
    const filter = ['id', 'userName', 'email', 'firstName', 'lastName',
      'password', 'sex', 'sexualPreference', 'birthday', 'biography',
      'pictures', 'interests', 'location']
    const input = pick(req.body, filter)
    try {
      const result = await user.getAllById(input)
      if (input.hasOwnProperty('email')) validate.email(input.email)
      if (input.hasOwnProperty('password')) validate.password(input)
      // const result = await user.update(input)
      res.json({msg: 'TODO'})
    } catch (err) {
      next(err)
    }
  }
}
