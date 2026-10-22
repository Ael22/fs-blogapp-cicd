const User = require('../models/user')
const jwt = require('jsonwebtoken')

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing ' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id);
  request.user = user;
  next()
}

const getTokenFrom = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next();
}

const errorHandler = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({
      error: 'expected `username` to be unique'
    })
  }

  next(error)
}

module.exports = {
  getTokenFrom, errorHandler, userExtractor
}