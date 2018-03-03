const {inSingleQuotes} = require('../helpers/regex')
const {capitalize} = require('../helpers/string')
const {RequestValidationError} = require('../helpers/error')

module.exports = (app) => {
  app.use(function notFound (req, res, next) {
    res
      .status(404)
      .json({error: 404, message: 'Not Found'})
  })

  app.use(function invalidJson (err, req, res, next) {
    if (err.type === 'entity.parse.failed') {
      err.statusCode = 422
      err.message = 'Unprocessable Entity'
    }
    next(err)
  })

  // TODO Pretify message when multiple fileds
  app.use(function missingInput (err, req, res, next) {
    if (err instanceof RequestValidationError) {
      err.statusCode = 400
      err.message = `Missing input ${err.fields}.`
    }
    next(err)
  })

  app.use(function dbDuplicate (err, req, res, next) {
    if (err.code === 'ER_DUP_ENTRY') {
      err.statusCode = 400
      let words = inSingleQuotes(err.sqlMessage)
      err.message = `${capitalize(words[1])} '${words[0]}' is already used.`
    }
    next(err)
  })

  app.use(function dbDuplicate (err, req, res, next) {
    if (err.code === 'ER_BAD_NULL_ERROR') {
      err.statusCode = 400
      let words = inSingleQuotes(err.sqlMessage)
      err.message = `'${words[0]}' is required.`
    }
    next(err)
  })

  // Catch all errors
  app.use(function errorsCatcher (err, req, res, next) {
    if (!err.statusCode || !err.message) {
      console.error(err)
      err.statusCode = 500
      err.message = 'Internal server error'
    }
    return res
      .status(err.statusCode)
      .json({ error: err.statusCode, message: err.message })
  })
}
