const Comment = require('../models/comment');
const Post = require('../models/post');
const createError = require('../utils/error');

const createComment = async (request, response, next) => {
  try {
    const { comment, post, user } = request.body;
    if (request.user.id !== user) {
      return next(createError('You are not allowed to create a comment', 403));
    }

    const newComment = await Comment.create({
      content: comment,
      post,
      user
    });

    await newComment.save();

    response.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

const getPostComments = async (request, response, next) => {
  try {
    const startIndex = parseInt(request.query.startIndex) || 0;
    let limit = parseInt(request.query.limit) || 9;
    let totalComments
    if (limit === -1) {
      totalComments = await Comment.countDocuments({ post: request.params.postId });
    } 
      const comments = await Comment.find({ post: request.params.postId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(5)
      .populate('user', { username: 1, profilePicture: 1 })
    
    response.status(200).json({ comments, totalComments });
  } catch (error) {
    next(error);
  }
}

const likeComment = async (request, response, next) => {
  try {
    const { commentId } = request.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(createError('Comment not found', 404));
    }

    const user = request.user.id;
    const userIndex = comment.likes.indexOf(user);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(user);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    // const isLiked = comment.likes.includes(user);
    // if (isLiked) {
    //   comment.likes = comment.likes.filter((like) => like !== user);
    //   comment.numberOfLikes -= 1;
    // } else {
    //   comment.numberOfLikes += 1;
    //   comment.likes.push(user);
    // }
    const savedComment = await comment.save();
    await savedComment.populate('user', { username: 1, profilePicture: 1 });
    

    response.status(200).json(savedComment);
  } catch (error) {
    next(error);
  }
}

const editComment = async (request, response, next) => {
  try {
    const { commentId } = request.params;
    const { content } = request.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(createError('Comment not found', 404));
    }
    const post = await Post.findById(comment.post);

    if (!request.user.isAdmin && (comment.user !== request.user.id) && (request.user.id !== post.user)) {
      return next(createError('You are not allowed to edit this comment', 403));
    }

    const editedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true, runValidators: true })
      .populate('user', { username: 1, profilePicture: 1 });


    response.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
}

const deleteComment = async (request, response, next) => { 
  try {
    const { commentId } = request.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(createError('Comment not found', 404));
    }
    const post = await Post.findById(comment.post);

    if (!request.user.isAdmin && comment.user.toString() !== request.user.id && request.user.id !== post.user.toString()) {
      return next(createError('You are not allowed to delete this comment', 403));
    }

    await Comment.findByIdAndDelete(commentId);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}

const getComments = async (request, response, next) => {
  try {
    const filter = request.query.userId ? { user: request.query.userId } : {};
    const startIndex = parseInt(request.query.startIndex) || 0;
    const limit = parseInt(request.query.limit) || 9;
    const sortBy = request.query.sort === 'asc' ? 1 : -1;

    const comments = await Comment.find(filter)
      .sort({ updatedAt: sortBy })
      .skip(startIndex)
      .limit(limit)
      .populate('user', { username: 1 })
      .populate('post', { title: 1 , slug: 1 });

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });
    
    response.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments
}