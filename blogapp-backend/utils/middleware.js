const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

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
    return response.status(401).json({ error: 'token expired' })
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

module.exports = {
  unknownEndpoint,
  errorHandler,
  customErrorHandler
}