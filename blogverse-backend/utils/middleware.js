const jwt = require('jsonwebtoken')
const createError = require('./error')
const User = require('../models/user')


const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && (error.message.includes('E11000 duplicate key error collection: BlogApp.users index: username'))) {
    return response.status(400).json({ error: 'expected username to be unique' })
  } else if (error.name === 'MongoServerError' && (error.message.includes('E11000 duplicate key error collection: BlogApp.users index: email'))) {
    return response.status(400).json({ error: 'expected email to be unique' })
  } else if (error.name === 'MongoServerError' && (error.message.includes('E11000 duplicate key error collection: BlogApp.blogs index: title'))) {
    return response.status(400).json({ error: 'expected blog title to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired - please re-authenticate' })
  }

  next(error)
}

const customErrorHandler = (error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error'
  response.status(statusCode).json({
    error: message
  })

  next(error)
}

const verifyUser = async (request, response, next) => {
  // const authorization = request.get('authorization')
  // if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
  //   const token = authorization.replace('bearer ', '')
  //   const decodedToken = jwt.verify(token, process.env.SECRET)
  //   if (!decodedToken.id) {
  //     return response.status(401).json({ error: 'token invalid' })
  //   }
  //   const user = await User.findById(decodedToken.id)
  //   if (!user) {
  //     return response.status(401).json({ error: 'user not found' })
  //   }
  //   request.user = user
  //   next()
  // } else {
  //   return response.status(401).json({ error: 'token missing' })
  // }

  const token = request.cookies.token
  if (!token) {
    return next(createError('Unauthorised', 401)) // token missing
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return next(createError('token expired - please re-authenticate', 401))
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return next(createError('Unauthorised', 401)) // user not found
  }
  request.user = user
  next()
}

module.exports = {
  errorHandler,
  customErrorHandler,
  verifyUser
}