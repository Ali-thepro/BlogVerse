const postRouter = require('express').Router();
const { create, getPosts, deletePost, editPost, distinctCategories, likePost } = require('../controllers/postController');
const middleware = require('../utils/middleware');

postRouter.post('/create', middleware.verifyUser, create);
postRouter.get('/getposts', getPosts);
postRouter.delete('/delete/:postId', middleware.verifyUser, deletePost);
postRouter.put('/edit/:postId', middleware.verifyUser, editPost);
postRouter.get('/categories', distinctCategories);
postRouter.put('/likepost/:postId', middleware.verifyUser, likePost);


module.exports = postRouter;  