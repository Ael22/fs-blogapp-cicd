const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    "title": "white",
    "author": "yo",
    "url": "not a clue",
    "likes": 12
  },
  {
    "title": "grey",
    "author": "me",
    "url": "forgot it",
    "likes": 0
  },
  {
    "title": "crimson",
    "author": "anon",
    "url": "lost the link",
    "likes": 84
  },
  {
    "title": "neon",
    "author": "who",
    "url": "whatever dot com",
    "likes": 3
  },
  {
    "title": "shadow",
    "author": "them",
    "url": "under construction",
    "likes": 211
  }
]

const initialUsers = [
  {
    username: "johndoe89",
    name: "John Doe",
    password: "Password123!"
  },
  {
    username: "alicesmith",
    name: "Alice Smith",
    password: "SecurePw567#"
  },
  {
    username: "bmarley",
    name: "Bob Marley",
    password: "Jammin456$"
  },
  {
    username: "charlie_brown",
    name: "Charlie Brown",
    password: "GoodGrief789%"
  },
  {
    username: "emily_w",
    name: "Emily Watson",
    password: "Sparkle991*"
  }
];

const nonExistingId = async () => {
  const blog = new Blog({
    "title": "bye",
    "author": "bye",
    "url": "bye",
    "likes": 0
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  initialBlogs, nonExistingId, blogsInDb,
  initialUsers, usersInDb
}