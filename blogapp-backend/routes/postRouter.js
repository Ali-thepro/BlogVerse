const postRouter = require('express').Router();
const { create } = require('../controllers/postController');
const middleware = require('../utils/middleware');

postRouter.post('/create',  middleware.verifyUser, create);

module.exports = postRouter;  