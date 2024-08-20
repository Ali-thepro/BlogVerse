const Comment = require('../models/comment');
const { createError } = require('../utils/error');

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
    let total
    if (limit === -1) {
      total = await Comment.countDocuments({ postId: request.params.id });
    } 
      const comments = await Comment.find({ postId: request.params.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(5)
      .populate('user', { username: 1, profilePicture: 1 });
    
    response.status(200).json({ comments, total });
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

    if (!request.user.isAdmin && comment.user !== request.user.id) {
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

    if (!request.user.isAdmin && comment.user !== request.user.id) {
      return next(createError('You are not allowed to delete this comment', 403));
    }

    await Comment.findByIdAndDelete(commentId);
    response.status(204).end();
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
}