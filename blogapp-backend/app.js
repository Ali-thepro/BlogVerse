const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./utils/config');
const logger = require('./utils/logger');

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
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


module.exports = app;