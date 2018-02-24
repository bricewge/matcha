const faker = require('faker')
const db = require('../db')
const Users = require('../models/Users')

const SEED_SIZE = 500

function fakeUser () {
  var user = {}
  user.userName = faker.internet.userName()
  user.email = faker.internet.email()
  user.firstName = faker.name.firstName()
  user.lastName = faker.name.lastName()
  user.password = faker.internet.password()
  return user
}

// TODO Manager error.code 'ER_DUP_ENTRY'
// TODO Generate activated user: sex, sexual preferences
async function seedUsers () {
  let userCount = 0
  // NOTE Use seed as a workaround until unique method is published
  // https://github.com/Marak/faker.js/issues/604
  faker.seed(userCount)
  db.connect()
  try {
    await db.drop('users')
    await Users.getAll()
      .then(function (data) { userCount = data.length })
    let promises = []
    for (var i = 0; i < SEED_SIZE - userCount; i++) {
      promises.push(Users.create(fakeUser()).then(() => userCount++))
    }
    await Promise.all(promises)
    console.log('Users:', userCount)
    // console.log(await Users.update({id: '500', sex: 'male'}))
  } catch (err) { console.log(err) }
  db.disconnect()
}

seedUsers()
