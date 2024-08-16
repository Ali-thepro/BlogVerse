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


module.exports = {
  create,
};