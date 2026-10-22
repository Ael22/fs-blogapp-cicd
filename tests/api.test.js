const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require("mongoose");
const supertest = require("supertest")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const app = require("../app")
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = await new User({
    username: 'test',
    name: 'test',
    password: passwordHash,
  }).save()

  token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.SECRET
  )

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({ ...blog, user: user._id }))
  await Promise.all(blogObjects.map(blog => blog.save()))
})

describe('GET API Test', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
    const blogs = response.body

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogs.length)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: "test",
      author: "test",
      url: "fake url",
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })

  test('id field is not _id', async () => {
    const blogs = await helper.blogsInDb();
    const allHaveId = blogs.every(blog => 'id' in blog)

    assert.strictEqual(allHaveId, true)
  })
})

describe('POST API Test', () => {
  test('missing likes property defaults to 0', async () => {
    const newBlog = {
      title: "test",
      author: "test",
      url: "fake url",
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .expect((res) => {
        if (res.body.likes !== 0) {
          throw new Error('Likes does not default to 0')
        }
      })
  })

  test('Missing title & url properties responds with 400', async () => {
    const newBlog = {
      author: "test",
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('Delete API test', () => {

  test('succeeds with 204 if id is valid', async () => {
    const notesAtStart = await helper.blogsInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/blogs/${noteToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)

    const notesAtEnd = await helper.blogsInDb();

    const ids = notesAtEnd.map(note => note.id);
    assert(!ids.includes(noteToDelete.id))

    assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length - 1);
  })

  test('fails with 400 if id is invalid', async () => {

    await api.delete(`/api/blogs/randomid`).set('Authorization', `Bearer ${token}`).expect(400)

  })
})

describe('PUT API test', () => {

  test('succeeds with 200 if id and body is valid', async () => {
    const notesAtStart = await helper.blogsInDb();
    const noteToUpdate = notesAtStart[0];

    const updateBody = {
      likes: 918
    }

    await api.put(`/api/blogs/${noteToUpdate.id}`).set('Authorization', `Bearer ${token}`).send(updateBody).expect(200)

    const notesAtEnd = await helper.blogsInDb();
    assert.strictEqual(notesAtEnd[0].likes, updateBody.likes)
  })

  test('Fails with 404 if id is invalid', async () => {
    await api.put(`/api/blogs/invalidId`).set('Authorization', `Bearer ${token}`).send({ likes: 999 }).expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
