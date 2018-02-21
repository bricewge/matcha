const validate = require('../helpers/validate')

module.exports = {
  register (req, res, next) {
    if (!validate.email(req.body.email)) {
      res
        .status(400)
        .json({error: 400, message: 'You must provide a valid email address'})
    } else if (!validate.password(req.body)) {
      res
        .status(400)
        .json({error: 400,
               message: `The password provided failed to match thoses rules:<br>
                         1. It should be more than 8 charaters<br>
                         2. It should be different than the other informations provided<br>
                         3. It shouldn't be a common password
                         `})
    } else {
      next()
    }
  }
}
