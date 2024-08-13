const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const createError = require("../utils/error");

const signup = async (request, response, next) => {
  const { username, email, password } = request.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(createError("All fields are required", 400));
  }

  if (
    !password ||
    password.length < 8 ||
    !/\d/.test(password) ||
    !/[a-zA-Z]/.test(password)
  ) {
    return next(
      createError(
        "Password must be at least 8 characters long and must contain at least one number and one letter",
        400
      )
    );
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    email,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
};

const signin = async (request, response, next) => { 
  const { email, password } = request.body;

  const user = await User.findOne({ email });
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return next(createError("Invalid email or password", 401));
  }

  const userForToken = {
    email: user.email,
    id: user._id,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 });

  response
    .status(200)
    .cookie('token', token, {
      httpOnly: true,
    })
    .json(user);
}


module.exports = {
  signup,
  signin,
};
