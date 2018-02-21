const {readFileSync} = require('fs')
const path = require('path')
const {keyIsUnique} = require('./object.js')

exports.email = function (email) {
  let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regexp.test(String(email).toLowerCase())
}

// TODO Use errors to explain why it failed
exports.password = function (input) {
  if (!('password' in input)) return false
  for (let key in input) { input[key] = input[key].toLowerCase() }
  if (input.password.length < 8) return false
  if (!keyIsUnique(input, 'password')) return false
  if (passwordIsCommon(input.password)) return false
  return true
}

// TODO Make it async
function passwordIsCommon (password) {
  let passwordsPath = path.join(__dirname, '../misc/passwords.txt')
  let commonPasswords = readFileSync(passwordsPath, 'utf8').trim().split('\n')
  password = password.toLowerCase()
  for (let key in commonPasswords) {
    if (password === commonPasswords[key]) return true
  }
  return false
}

// Should return false
var test01 = {
  userName: 'toto',
  email: 'to@t.o',
  password: 'QWERTYUI',
  firstName: 'Toto',
  lastName: 'OTOT'}
// Should return false
var test02 = {
  userName: 'toto',
  email: 'to@t.o',
  password: 'qwertyuisalut',
  firstName: 'Toto',
  lastName: 'OTOT'}
// console.log(exports.password(test01))
// console.log(exports.password(test02))
