const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
  post: {
    type: String
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER'
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
})

const Post = mongoose.model('POST', PostSchema)
module.exports = Post
