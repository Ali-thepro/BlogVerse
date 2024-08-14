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
    return next(createError('You are not allowed to updated this user', 401))
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

module.exports = {
  test,
  update
} 