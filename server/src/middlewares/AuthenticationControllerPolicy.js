const validate = require('../helpers/validate')

module.exports = {
  register (req, res, next) {
    if (!validate.email(req.body.email)) {

    } else if (!validate.password(req.body)) {

    }
      next()
  }
}
