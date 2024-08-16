const mongoose = require('mongoose');

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
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],
  },
  { timestamps: true }
)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User