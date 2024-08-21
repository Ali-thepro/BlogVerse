const mongoose = require('mongoose');
const Post = require('./post');
const Comment = require('./comment');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: [7, 'username must be at least 7 characters long'],
      maxlength: [20, 'username must not be more than 20 characters'],
      validate: [
        {
          validator: function (v) {
            return /^[a-zA-Z0-9]+$/.test(v);
          },
          message: (props) => {
            return 'username can only contain letters and numbers'; 
          }
        }
      ]
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

userSchema.pre('findOneAndDelete', async function(next) {
  try {
    const query = this.getQuery();
    const userId = query._id;
    const posts = await Post.find({ user: userId });
    const postIds = posts.map(post => post._id);

    await Post.deleteMany({ user: userId });
    
    await Comment.deleteMany({ post: { $in: postIds } });

    next();
  } catch (err) {
    next(err);
  }
});
const User = mongoose.model('User', userSchema);

module.exports = User;