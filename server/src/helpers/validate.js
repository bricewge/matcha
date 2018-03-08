const {readFileSync} = require('fs')
const path = require('path')
const cache = require('memory-cache')
const {valueIsUnique, missingKeys, is} = require('./object.js')
const {AppError, RequestValidationError} = require('../helpers/error')

exports.email = function (email) {
  let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!regexp.test(String(email).toLowerCase())) {
    throw new AppError('Email is invalid.', 400)
  }
}

exports.password = function (input) {
  if (!('password' in input)) {
    throw new RequestValidationError('password')
  }
  for (let key in input) {
    if (is('String', input[key])) {
      input[key] = input[key].toLowerCase()
    }
  }
  if (input.password.length < 8) {
    throw new AppError('Password has to be more than 8 characters.', 400)
  } else if (!valueIsUnique(input, 'password')) {
    throw new AppError('Password can\'t be the same as an other input.', 400)
  } else if (passwordIsCommon(input.password)) {
    throw new AppError('Password is too common.', 400)
  }
}

function passwordIsCommon (password) {
  let commonPasswords = cache.get('commonPasswords')
  if (!commonPasswords) {
    let passwordsPath = path.join(__dirname, '../misc/passwords.txt')
    commonPasswords = readFileSync(passwordsPath, 'utf8').trim().split('\n')
    cache.put('commonPasswords', commonPasswords)
  }
  password = password.toLowerCase()
  for (let key in commonPasswords) {
    if (password === commonPasswords[key]) return true
  }
  return false
}

exports.input = function (input, expected) {
  const missing = missingKeys(input, expected)
  if (missing.length) {
    throw new RequestValidationError(missing)
  } else {
    return true
  }
}

exports.enum = function (input, expected) {
  for (let key in expected) {
    if (input.hasOwnProperty(key) && !expected[key].includes(input[key])) {
      return false
    }
  }
  return true
}

exports.location = function (c) {
  const err = new AppError('Invalid coordinates', 400)
  if (c.latitude > 90 || c.latitude < -90) throw err
  if (c.longitude > 180 || c.longitude < -180) throw err
}

// Should return false
// var test01 = {
//   userName: 'toto',
//   email: 'to@t.o',
//   password: 'QWERTYUI',
//   firstName: 'Toto',
//   lastName: 'OTOT'}
// Should return false
// var test02 = {
//   userName: 'toto',
//   email: 'to@t.o',
//   password: 'qwertyuisalut',
//   firstName: 'Toto',
//   lastName: 'OTOT'}
// const test03 = {
//   activation: ['register', 'active', 'fake'],
//   sex: ['male', 'female'],
//   sexualPreference: ['hetero', 'homo', 'bi']
// }
// console.log(exports.password(test01))
// console.log(exports.password(test02))
// console.log(exports.input(test01, ['userName']))
// console.log(exports.input(test01, ['trololol']))
// console.log(exports.enum({sex: 'inter'}, test03))
// console.log(exports.enum({sex: 'female'}, test03))
// console.log(exports.enum({sex: 'male'}, test03))
