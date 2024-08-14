const userRouter = require('express').Router();
const { test, update } = require('../controllers/userController');
const middleware = require('../utils/middleware');

userRouter.get('/test', test);
userRouter.put('/update/:id', middleware.verifyUser, update);

module.exports = userRouter;