const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const signup = async (request, response) => { 
  const { username, email, password } = request.body;

  if (!username || !email || !password || username === '' || email === '' || password === '') { 
    return response.status(400).json({ error: 'All fields are required' });
  }


  if (!password || password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    return response.status(400).json({ error: 'Password must be at least 8 characters long and contain both letters and numbers' });
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    email,
    passwordHash,
  });

  const savedUser = await user.save()
  response.status(201).json(savedUser)
}

module.exports = {
  signup
}