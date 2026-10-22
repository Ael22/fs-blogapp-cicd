const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const supertest = require("supertest")
const app = require("../app")
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({});

  const usersToAdd = helper.initialUsers.map(user => new User({
    ...user,
    password: bcrypt.hashSync(user.password, 10)
  }))

  await User.insertMany(usersToAdd)
})

describe('User POST API test', () => {

  test('invalid user is created and returns status 400', async () => {
    const invalidUser = {
      username: "sh",
      name: "or",
      password: "t-"
    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
  })

  test('duplicate username returns status 400', async () => {
    const users = await helper.usersInDb();
    const usernameToAdd = users[0].username;

    const userToAdd = {
      username: usernameToAdd,
      name: 'real name',
      password: "verySecurePassword"
    }

    await api
      .post('/api/users')
      .send(userToAdd)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})