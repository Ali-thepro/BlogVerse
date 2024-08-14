const userRouter = require('express').Router();
const { test, update, deleteUser, signOut } = require('../controllers/userController');
const middleware = require('../utils/middleware');

userRouter.get('/test', test);
userRouter.put('/update/:id', middleware.verifyUser, update);
userRouter.delete('/delete/:id', middleware.verifyUser, deleteUser);
userRouter.post('/signout', signOut);

module.exports = userRouter;