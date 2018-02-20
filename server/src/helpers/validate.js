const helperObj = require('./object.js')

exports.email = function (email) {
  let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regexp.test(String(email).toLowerCase())
}

// TODO Test against 100000 common passowrds
// TODO Password should be unique in a user's data (ie: email, username, ...)
exports.password = function (input) {
  for (let key in input) { input[key].toLowerCase() }
  // console.log(input)
  if (input.password.length < 8) return false
  if (!helperObj.keyIsUnique(input, 'password')) return false
  return true
}

// Should return false
var data = {
  userName: 'qwertyui',
  email: 'to@t.o',
  password: 'qwertyui',
  firstName: 'Toto',
  lastName: 'OTOT'}

console.log(exports.password(data))
