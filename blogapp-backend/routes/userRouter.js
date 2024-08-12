const userRouter = require('express').Router()
const { test } = require('../controllers/userController')

userRouter.get('/test', test)

module.exports = userRouter