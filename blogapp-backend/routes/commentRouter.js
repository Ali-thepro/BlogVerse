const commentRouter = require('express').Router();
const middleware = require('../utils/middleware');
const { createComment, getPostComments, likeComment, editComment, deleteComment } = require('../controllers/commentController');

commentRouter.post('/create', middleware.verifyUser, createComment);
commentRouter.get('/getpostcomments/:postId', getPostComments);
commentRouter.put('/likecomment/:commentId', middleware.verifyUser, likeComment);
commentRouter.put('/editcomment/:commentId', middleware.verifyUser, editComment);
commentRouter.delete('/deletecomment/:commentId', middleware.verifyUser, deleteComment);

module.exports = commentRouter;