const authRouter = require('express').Router()
const { signup } = require('../controllers/authController')

authRouter.post('/signup', signup)

module.exports = authRouter