const Post = require('../models/post')
const createError = require('../utils/error')

const create = async (request, response) => {
  const { title } = request.body

  const user = request.user
  
  const slug = title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '')
  
  const newPost = new Post({
    ...request.body,
    slug,
    user: user._id
  })
  const savedPost = await newPost.save()
  response.status(201).json(savedPost)
}

const getPosts = async (request, response) => {
  // const posts = await Post.find({}).populate('user', { username: 1, email: 1, profilePicture: 1 })
  // response.status(200).json(posts)

  const filter = {
    ...(request.query.userId ? { user: request.query.userId } : {}),
    ...(request.query.category ? { category: request.query.category } : {}),
    ...(request.query.slug ? { slug: request.query.slug } : {}),
    ...(request.query.postId ? { _id: request.query.postId } : {}),
    ...(request.query.searchTerm ? {
      $or: [
        { title: { $regex: request.query.searchTerm, $options: 'i' } },
        { content: { $regex: request.query.searchTerm, $options: 'i' } },
      ]
    } : {}),
    ...(request.query.likedBy ? { likes: { $in: [request.query.likedBy] } } : {})
  }

  const startIndex = parseInt(request.query.startIndex) || 0
  const limit = parseInt(request.query.limit) || 9
  const sortBy = request.query.sort === 'asc' ? 1 : -1
  const sortField = request.query.sortField === 'likes' ? 'numberOfLikes'
    : request.query.sortField === 'createdAt' ? 'createdAt' : 'updatedAt'

  const posts = await Post.find(filter)
    .sort({ [sortField]: sortBy })
    .skip(startIndex)
    .limit(limit)
    .populate('user', { username: 1, email: 1, profilePicture: 1 })
  
  const totalPosts = await Post.countDocuments()

  const now = new Date()

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  )

  const lastMonthPosts = await Post.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  })

  response.status(200).json({
    posts,
    totalPosts,
    lastMonthPosts,
  })
}

const likePost = async (request, response, next) => {
  try {
    const { postId } = request.params;
    const post = await Post.findById(postId);
    if (!post) {
      return next(createError('Post not found', 404));
    }

    const user = request.user.id;
    const userIndex = post.likes.indexOf(user);
    if (userIndex === -1) {
      post.numberOfLikes += 1;
      post.likes.push(user);
    } else {
      post.numberOfLikes -= 1;
      post.likes.splice(userIndex, 1);
    }

    const savedPost = await post.findByIdAndUpdate(
      postId,
      {
        likes: post.likes,
        numberOfLikes: post.numberOfLikes,
      },
      { new: true, timestamps: false }
    );

    response.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
}

const deletePost = async (request, response, next) => { 
  const { postId } = request.params

  const post = await Post.findById(postId)
  
  if (!post) {
    return next(createError('Post not found', 404))
  }
  if (!request.user.isAdmin && post.user.toString() !== request.user.id) {
    return next(createError('You are not allowed to delete this post', 403))
  }
  try {
    await Post.findByIdAndDelete(postId)
    response.status(204).end()
  } catch (error) { 
    next(error)
  }
}

const editPost = async (request, response, next) => {
  const { postId } = request.params
  // const { title, content, category, image } = request.body

  const post = await Post.findById(postId)

  if (!post) {
    return next(createError('Post not found', 404))
  }
  let slug
  if (request.body.title) { 
    slug = request.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '')
  }

  const update = {
    $set: {
      title: request.body.title,
      content: request.body.content,
      category: request.body.category,
      image: request.body.image,
      slug
    }
  }

  if (!request.user.isAdmin && post.user.toString() !== request.user.id) {
    return next(createError('You are not allowed to edit this post', 403))
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      update,
      { new: true, runValidators: true, context: 'query' })
      .populate('user', { username: 1, email: 1, profilePicture: 1 })
    response.json(updatedPost)

  } catch (error) {
    next(error)
  }

}

const distinctCategories = async (request, response) => { 
  const categories = await Post.distinct('category')
  const newCategories = categories.filter(category => category !== 'Uncategorised')
  response.status(200).json(newCategories)
}


module.exports = {
  create,
  getPosts,
  deletePost,
  editPost,
  distinctCategories,
  likePost
};

// not very safe as not checking if user is the owner of the post
// const deletePost = async (req, res, next) => {
//   const { postId, userId } = req.params;

//   if (req.user.id !== userId) {
//     return next(createError('Unauthorized', 4013));
//   }

//   try {
//     await Post.findByIdAndDelete(postId);
//     res.status(204).end();
//   } catch (error) {
//     next(error);
//   }
// }


// const getPostByUser = async (request, response) => {
//   const id = request.user._id
//   const posts = await Post.find({ user: id }).populate('user', { username: 1, email: 1, profilePicture: 1 })
//   response.status(200).json(posts)
// }

// const deletePost = async (request, response, next) => { 
//   const { postId } = request.params

//   const post = await Post
//     .findById(postId)
//     .populate('user', { username: 1, email: 1, profilePicture: 1 })
  
//   if (!post) {
//     return next(createError(404, 'Post not found'))
//   }

//   if (post.user.id !== request.user.id) {
//     return next(createError('Unauthorized', 403))
//   }

//   await post.findByIdAndDelete(postId)
  
// }
