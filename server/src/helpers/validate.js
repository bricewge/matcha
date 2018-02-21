const {readFileSync} = require('fs')
const path = require('path')
const {keyIsUnique} = require('./object.js')
var cache = require('memory-cache')

exports.email = function (email) {
  let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!regexp.test(String(email).toLowerCase())) {
    throw Error('\'email\' is invalid.')
  }
}

exports.password = function (input) {
  if (!('password' in input)) {
    throw Error('\'password\' is required.')
  }
  for (let key in input) { input[key] = input[key].toLowerCase() }
  if (input.password.length < 8) {
    throw Error('\'password\' has to bo more than 8 characters')
  } else if (!keyIsUnique(input, 'password')) {
    throw Error('\'password\' can\'t be the as another input.')
  } else if (passwordIsCommon(input.password)) {
    throw Error('\'password\' is too common.')
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

// // Should return false
// var test01 = {
//   userName: 'toto',
//   email: 'to@t.o',
//   password: 'QWERTYUI',
//   firstName: 'Toto',
//   lastName: 'OTOT'}
// // Should return false
// var test02 = {
//   userName: 'toto',
//   email: 'to@t.o',
//   password: 'qwertyuisalut',
//   firstName: 'Toto',
//   lastName: 'OTOT'}
// console.log(exports.password(test01))
// console.log(exports.password(test02))
