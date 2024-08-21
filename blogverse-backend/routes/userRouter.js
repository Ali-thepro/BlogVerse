const userRouter = require('express').Router();
const {  update, deleteUser, signOut, getUsers } = require('../controllers/userController');
const middleware = require('../utils/middleware');

userRouter.put('/update/:id', middleware.verifyUser, update);
userRouter.delete('/delete/:id', middleware.verifyUser, deleteUser);
userRouter.post('/signout', signOut);
userRouter.get('/getusers', getUsers);

module.exports = userRouter;