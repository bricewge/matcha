const validate = require('../helpers/validate')

module.exports = {
  register (req, res, next) {
    try {
      validate.email(req.body.email)
      validate.password(req.body)
      next()
    } catch (err) {
      res
        .status(400)
        .json({error: 400, message: err.message})
    }
  }
}
