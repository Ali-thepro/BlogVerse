const post = require('../models/post')
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
    user: request.user._id
  })
  const savedPost = await newPost.save()
  user.posts = user.posts.concat(savedPost._id)
  await user.save()
  const populatedPost = await savedPost.populate('user', { username: 1, email: 1, profilePicture: 1 })
  response.status(201).json(populatedPost)
}

const getPosts = async (request, response) => {
  // const posts = await Post.find({}).populate('user', { username: 1, email: 1, profilePicture: 1 })
  // response.status(200).json(posts)

  const filter = {
    ...(request.query.userId ? { user: request.query.userId } : {}),
    ...(request.query.category ? { category: request.query.category } : {}),
    ...(request.query.slug ? { slug: request.query.slug } : {}),
    ...(request.query.postId ? { _id: request.query.postId } : {}),
    ...(request.query.search ? {
      $or: [
        { title: { $regex: request.query.search, $options: 'i' } },
        { content: { $regex: request.query.search, $options: 'i' } },
      ]
    } : {}),
  }

  const startIndex = parseInt(request.query.startIndex) || 0
  const limit = parseInt(request.query.limit) || 9
  const sortBy = request.query.order === 'asc' ? 1 : -1
  const posts = await Post.find(filter)
    .sort({ updatedAt: sortBy })
    .skip(startIndex)
    .limit(limit)
    .populate('user', { username: 1, email: 1, profilePicture: 1 })
  
  // const postsByFilter = await Post.countDocuments(filter)
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



const deletePost = async (request, response, next) => { 
  const { postId } = request.params

  const post = await Post.findById(postId)
  
  if (!post) {
    return next(createError('Post not found', 404))
  }
  if (request.user.isAdmin || post.user.toString() === request.user.id) {
    try {
      await Post.findByIdAndDelete(postId)
      response.status(204).end()
    } catch (error) { 
      next(error)
    }
  } else {
    return next(createError('Unauthorized', 403))
  }
}

const editPost = async (request, response, next) => {
  const { postId } = request.params
  // const { title, content, category, image } = request.body

  const post = await Post.findById(postId)

  if (!post) {
    return next(createError('Post not found', 404))
  }

  const update = {
    $set: {
      title: request.body.title,
      content: request.body.content,
      category: request.body.category,
      image: request.body.image,
    }
  }

  if (request.user.isAdmin || post.user.toString() === request.user.id) {
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
  } else {
    return next(createError('Unauthorized', 403))
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
  distinctCategories
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
