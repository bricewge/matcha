const faker = require('faker')
const db = require('../db')
const user = require('../models/users')

const SEED_SIZE = 500
const SEXS = ['Male', 'Female']
const SEXUAL_PREFRENCES = ['Hetero', 'Homo', 'Bi']

function randItem (array) {
  return array[Math.floor(Math.random() * array.length)]
}

// Min inclusive, max exclusive
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function fakeUser () {
  var user = {}
  user.userName = faker.internet.userName()
  user.email = faker.internet.email()
  user.firstName = faker.name.firstName()
  user.lastName = faker.name.lastName()
  user.password = faker.internet.password()
  user.activation = 'active'
  user.sex = randItem(SEXS)
  user.sexualPreference = randItem(SEXUAL_PREFRENCES)
  user.age = getRandomInt(18, 78)
  user.biography = faker.lorem.paragraph()
  user.picture0 = faker.image.avatar()
  user.picture1 = faker.image.imageUrl(400, 400, 'people')
  user.picture2 = faker.image.imageUrl(400, 400, 'people')
  user.picture3 = faker.image.imageUrl(400, 400, 'people')
  user.picture4 = faker.image.imageUrl(400, 400, 'people')
  user.locationName = faker.image.city()
  user.location = {
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude()
  }
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
    await user.getAll()
      .then(function (data) { userCount = data.length })
    let promises = []
    for (var i = 0; i < SEED_SIZE - userCount; i++) {
      promises.push(user.create(fakeUser()).then(() => userCount++))
    }
    await Promise.all(promises)
    console.log('Users:', userCount)
    // console.log(await Users.update({id: '500', sex: 'male'}))
  } catch (err) { console.log(err) }
  db.disconnect()
}

seedUsers()
