const faker = require('faker')
const db = require('../db')
const user = require('../models/users')
const interest = require('../models/interests')

const SEED_SIZE = 500
const SEXS = ['m', 'f']
const SEXUAL_PREFRENCES = ['f', 'm', 'm,f']
const INTERESTS = [
  'code', '42', 'biology',
  'nature', 'running', 'climbing',
  'fake', 'sex', 'drugs',
  'rock\'n\'roll'
]

function fakeUsers (count) {
  let users = {}
  let emails = {}
  for (let i = 0; i < count; i++) {
    // We dont wan't duplicates
    let userName = faker.internet.userName()
    while (users[userName]) {
      userName = faker.internet.userName()
    }
    let email = faker.internet.email()
    while (emails[email]) {
      email = faker.internet.email()
    }
    const sex = faker.random.number({min: 0, max: 1})
    const firstName = faker.name.firstName(sex)
    const lastName = faker.name.lastName()
    const password = faker.internet.password()
    const user = {
      userName: userName,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      activation: 'active',
      sex: SEXS[sex],
      sexualPreference: faker.random.arrayElement(SEXUAL_PREFRENCES),
      age: faker.random.number({min: 18, max: 77}),
      biography: faker.lorem.paragraph(),
      picture0: `https://api.adorable.io/avatars/400/${userName}.png`,
      picture1: `https://api.adorable.io/avatars/400/${email}.png`,
      picture2: `https://api.adorable.io/avatars/400/${firstName}.png`,
      picture3: `https://api.adorable.io/avatars/400/${lastName}.png`,
      picture4: `https://api.adorable.io/avatars/400/${password}.png`,
      locationName: faker.address.city(),
      location: {
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude()
      },
      fame: faker.random.number({min: 42, max: 420})
    }
    users[userName] = user
    emails[email] = email
  }
  return users
}

// TODO Manage error.code 'ER_DUP_ENTRY'
// TODO never generate duplicates
async function seedUsers () {
  try {
    db.connect()
    // await db.drop('users')
    let userCount = (await user.getAll()).length
    let addedUsers = 0
    let maxUserId = 1
    const users = fakeUsers(SEED_SIZE - userCount)
    let promises = []
    for (let index in users) {
      promises.push(
        user.create(users[index])
          .then(function (res) {
            maxUserId = Math.max(res.id, maxUserId)
          })
      )
      addedUsers++
    }
    await Promise.all(promises)
    console.log('New users:', addedUsers)
    for (let i = 0; i < addedUsers; i++) {
      let interests = faker.random.arrayElements(INTERESTS)
      for (let j in interests) {
        promises.push(interest.create({
          userId: maxUserId - i,
          interest: interests[j]
        }))
      }
    }
    await Promise.all(promises)
  } catch (err) { }
  db.disconnect()
}

seedUsers()
