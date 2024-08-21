const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const userRouter = require('./routes/userRouter.js')
const authRouter = require('./routes/authRouter.js')
const postRouter = require('./routes/postRouter.js')
const commentRouter = require('./routes/commentRouter')
const cookieParser = require('cookie-parser')
const path = require('path')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(request => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })


morgan.token('body', (req) => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/comments', commentRouter)

app.use(express.static(path.join(__dirname, '../blogverse-frontend/dist')))

app.get('*', (req, res) => { 
  res.sendFile(path.join(__dirname, '../blogverse-frontend', 'dist', 'index.html'))
})

app.use(middleware.errorHandler)
app.use(middleware.customErrorHandler)

module.exports = app;