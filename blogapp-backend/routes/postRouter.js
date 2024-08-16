const postRouter = require('express').Router();
const { create, getPosts, getPostByUser } = require('../controllers/postController');
const middleware = require('../utils/middleware');

postRouter.post('/create', middleware.verifyUser, create);
postRouter.get('/getposts', getPosts);
postRouter.get('/getpostbyuser', middleware.verifyUser, getPostByUser);

module.exports = postRouter;  