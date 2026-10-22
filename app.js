const express = require('express')
const mongoose = require('mongoose')
const path = require('node:path')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const dns = require('node:dns/promises')
const loginRouter = require('./controllers/login')
const { errorHandler, getTokenFrom } = require('./utils/middleware')

const app = express()

dns.setServers(['1.1.1.1', '8.8.8.8'])
// connect to mongodb
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error)
  })

app.use(express.json())
app.use(getTokenFrom)

app.get('/health', (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).send('database is cooked')
  }
  res.status(200).send('ok')
})

app.use(express.static('dist'))

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.get('/{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next()
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use(errorHandler)

module.exports = app