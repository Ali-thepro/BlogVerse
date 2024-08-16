const Post = require('../models/post')

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

const getPostByUser = async (request, response) => {
  const id = request.user._id
  const posts = await Post.find({ user: id }).populate('user', { username: 1, email: 1, profilePicture: 1 })
  response.status(200).json(posts)
}

module.exports = {
  create,
  getPosts,
  getPostByUser
};