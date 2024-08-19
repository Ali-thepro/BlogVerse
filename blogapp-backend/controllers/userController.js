const bcrypt = require('bcrypt')
const User = require('../models/user')
const createError = require('../utils/error')

const test = async (request, response) => { 
  response.send('Api is working')
}

const update = async (request, response, next) => {
  const { id } = request.params
  // console.log(request.user._id.toString())
  if (request.user._id.toString() !== id) {
    return next(createError('You are not allowed to updated this user', 403))
  }

  if (request.body.password) {
    if (
      !request.body.password ||
      request.body.password.length < 8 ||
      !/\d/.test(request.body.password) ||
      !/[a-zA-Z]/.test(request.body.password)
    ) {
      return next(createError("Password must be at least 8 characters long and must contain at least one number and one letter",400));
    }
    request.body.password = await bcrypt.hash(request.body.password, 10);
  }


  // const user = {
  //   username,
  //   email,
  //   passwordHash,
  //   profilePicture
  // }
  // dont update user and use $set to update only the fields that are provided

  const update = {
    $set: {
      username: request.body.username,
      email: request.body.email,
      passwordHash: request.body.password,
      profilePicture: request.body.profilePicture
    }
  };

  const updatedUser = await User.findByIdAndUpdate(
    id,
    update,
    { new: true, runValidators: true, context: 'query' }
  );
  response.json(updatedUser);
}

const deleteUser = async (request, response, next) => {
  const { id } = request.params
  if (!request.user.isAdmin && request.user._id.toString() !== id) {
    return next(createError('You are not allowed to delete this user', 403))
  }
  try {
    await User.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
}

const signOut = async (request, response) => { 
  response
    .clearCookie('token')
    .status(200)
    .send('User signed out successfully')
}

const getUsers = async (request, response, next) => {
  try {
    const startIndex = parseInt(request.query.startIndex) || 0
    const limit = parseInt(request.query.limit) || 9
    const sortBy = request.query.order === 'asc' ? 1 : -1
    const users = await User.find()
      .sort({ createdAt: sortBy })
      .skip(startIndex)
      .limit(limit)
    
    const totalUsers = await User.countDocuments()

    const now = new Date()

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    )

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    response.status(200).json({
      users,
      totalUsers,
      lastMonthUsers
    })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  test,
  update,
  deleteUser,
  signOut,
  getUsers
} 