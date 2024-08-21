const mongoose = require('mongoose');
const Comment = require('./comment');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: {
      type: String,
      default: 'Uncategorised',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});


postSchema.pre('findOneAndDelete', async function(next) {
  try {
    const query = this.getQuery();
    const postId = query._id;
    await Comment.deleteMany({ post: postId });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Post', postSchema);